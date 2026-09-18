import os
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["JWT_SECRET"] = "test-secret-that-is-long-enough-32!"
os.environ["AUTH_COOKIE_SECURE"] = "false"

from fastapi.testclient import TestClient

from app.main import _login_attempts, app

client = TestClient(app)


def csrf_headers():
    response = client.get("/auth/csrf")
    assert response.status_code == 200
    token = client.cookies.get("csrf_token")
    assert token
    return {"X-CSRF-Token": token}


def test_health_and_security_headers():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"


def test_cookie_auth_and_task_isolation():
    headers = csrf_headers()
    email = "jack@example.com"
    register = client.post("/auth/register", json={"email": email, "password": "correct horse battery staple"}, headers=headers)
    assert register.status_code == 201

    login = client.post("/auth/login", json={"email": email, "password": "correct horse battery staple"}, headers=csrf_headers())
    assert login.status_code == 200
    assert "access_token" not in login.json()
    assert client.cookies.get("access_token") is not None
    assert client.cookies["access_token"]

    me = client.get("/me")
    assert me.status_code == 200
    assert me.json()["email"] == email

    created = client.post("/tasks", json={"title": "Secure task", "description": "Owned by Jack"}, headers=csrf_headers())
    assert created.status_code == 201
    tasks = client.get("/tasks")
    assert tasks.status_code == 200
    assert len(tasks.json()) == 1
    assert tasks.json()[0]["owner_id"] == me.json()["id"]


def test_state_change_without_csrf_is_blocked():
    client.get("/auth/csrf")
    response = client.post("/tasks", json={"title": "blocked", "description": "no csrf"})
    assert response.status_code == 403
    assert response.json()["detail"] == "CSRF validation failed"


def test_invalid_credentials_and_login_rate_limit():
    _login_attempts.clear()
    csrf_headers()
    email = "rate-limit@example.com"
    client.post("/auth/register", json={"email": email, "password": "correct horse battery staple"}, headers=csrf_headers())
    statuses = []
    for _ in range(11):
        response = client.post("/auth/login", json={"email": email, "password": "wrong password here"}, headers=csrf_headers())
        statuses.append(response.status_code)
    assert statuses[:10] == [401] * 10
    assert statuses[10] == 429
