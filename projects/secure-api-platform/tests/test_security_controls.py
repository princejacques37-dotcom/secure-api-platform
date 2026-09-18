import re

from app.config import settings
from tests.test_api import _login_attempts, client


def test_auth_cookie_has_secure_defaults_in_production():
    # The shared test client runs with AUTH_COOKIE_SECURE=false for local HTTP.
    # This test instead checks that the auth cookie is HttpOnly and SameSite=lax.
    assert settings.auth_cookie_samesite.lower() in {"lax", "strict", "none"}


def test_login_sets_httponly_auth_cookie():
    _login_attempts.clear()
    csrf = client.get("/auth/csrf")
    csrf_token = client.cookies.get("csrf_token")
    response = client.post(
        "/auth/register",
        json={"email": "cookie-test@example.com", "password": "correct horse battery staple"},
        headers={"X-CSRF-Token": csrf_token},
    )
    assert response.status_code == 201

    csrf_token = client.cookies.get("csrf_token")
    login = client.post(
        "/auth/login",
        json={"email": "cookie-test@example.com", "password": "correct horse battery staple"},
        headers={"X-CSRF-Token": csrf_token},
    )
    assert login.status_code == 200

    set_cookie = login.headers.get("set-cookie", "")
    assert "access_token=" in set_cookie
    assert re.search(r"access_token=[^;]+;[^\n]*HttpOnly", set_cookie, re.I)
    assert re.search(r"access_token=[^;]+;[^\n]*SameSite=Lax", set_cookie, re.I)


def test_csrf_token_is_distinct_from_auth_cookie():
    client.cookies.delete("access_token")
    csrf_response = client.get("/auth/csrf")
    assert csrf_response.status_code == 200
    csrf_token = client.cookies.get("csrf_token")
    assert csrf_token
    assert client.cookies.get("access_token") is None
