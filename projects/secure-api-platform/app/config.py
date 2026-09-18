from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    access_token_minutes: int = 30
    app_env: str = "development"
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    auth_cookie_secure: bool = False
    auth_cookie_samesite: str = "lax"
    auth_cookie_name: str = "access_token"
    csrf_cookie_name: str = "csrf_token"
    rate_limit_window_seconds: int = 60
    login_rate_limit: int = 10

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
