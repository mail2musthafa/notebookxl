from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "NotebookXL API"
    app_version: str = "0.1.0"
    app_env: str = "development"
    frontend_url: str = "http://127.0.0.1:4176"

    model_config = SettingsConfigDict(env_prefix="NOTEBOOKXL_", extra="ignore")


settings = Settings()
