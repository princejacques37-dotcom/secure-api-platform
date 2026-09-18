import logging
import secrets
import time
import uuid
from collections import defaultdict

from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette.middleware.base import BaseHTTPMiddleware

from .config import settings
from .db import Base, engine, get_db
from .deps import get_current_user, require_csrf
from .models import Task, User
from .schemas import LoginIn, RegisterIn, TaskIn, TaskOut, UserOut
from .security import create_access_token, hash_password, verify_password

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("secure-api")

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Secure API Platform", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token", "X-Request-ID"],
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        response: Response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["Cache-Control"] = "no-store" if request.url.path.startswith(("/auth", "/me", "/tasks")) else "no-cache"
        return response


app.add_middleware(SecurityHeadersMiddleware)

_login_attempts: dict[str, list[float]] = defaultdict(list)


def _rate_limit_login(request: Request) -> None:
    now = time.monotonic()
    key = request.client.host if request.client else "unknown"
    attempts = [t for t in _login_attempts[key] if now - t < settings.rate_limit_window_seconds]
    if len(attempts) >= settings.login_rate_limit:
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
    attempts.append(now)
    _login_attempts[key] = attempts


def _set_auth_cookies(response: Response, user_id: int) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=create_access_token(user_id),
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        max_age=settings.access_token_minutes * 60,
        path="/",
    )
    response.set_cookie(
        key=settings.csrf_cookie_name,
        value=secrets.token_urlsafe(32),
        httponly=False,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        max_age=settings.access_token_minutes * 60,
        path="/",
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/auth/csrf")
def csrf(response: Response) -> dict[str, str]:
    response.set_cookie(
        key=settings.csrf_cookie_name,
        value=secrets.token_urlsafe(32),
        httponly=False,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        max_age=settings.access_token_minutes * 60,
        path="/",
    )
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserOut, status_code=201, dependencies=[Depends(require_csrf)])
def register(payload: RegisterIn, response: Response, db: Session = Depends(get_db)) -> User:
    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="An account with that email already exists") from exc
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=UserOut, dependencies=[Depends(require_csrf)])
def login(payload: LoginIn, request: Request, response: Response, db: Session = Depends(get_db)) -> User:
    _rate_limit_login(request)
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    _set_auth_cookies(response, user.id)
    return user


@app.post("/auth/logout", dependencies=[Depends(require_csrf)])
def logout(response: Response) -> dict[str, str]:
    response.delete_cookie(settings.auth_cookie_name, path="/")
    response.delete_cookie(settings.csrf_cookie_name, path="/")
    return {"status": "signed_out"}


@app.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@app.post("/tasks", response_model=TaskOut, status_code=201, dependencies=[Depends(require_csrf)])
def create_task(
    payload: TaskIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Task:
    task = Task(owner_id=current_user.id, title=payload.title.strip(), description=payload.description.strip())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Task]:
    return list(db.scalars(select(Task).where(Task.owner_id == current_user.id).order_by(Task.id.desc())))
