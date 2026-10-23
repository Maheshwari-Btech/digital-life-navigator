"""
Application configuration for Digital Life Navigator.
Loads environment variables safely with defaults for local ₹0 execution.
"""

import json
from typing import List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Digital Life Navigator"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "127.0.0.1"

    # CORS origins
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://digital-life-navigator.vercel.app",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(
        cls, v: Union[str, List[str], None]
    ) -> List[str]:
        if v is None:
            return [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8000",
                "http://127.0.0.1:8000",
                "https://digital-life-navigator.vercel.app",
            ]

        if isinstance(v, str):
            if not v.strip():
                return []

            if v.startswith("["):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [
                            str(item).strip()
                            for item in parsed
                            if str(item).strip()
                        ]
                except (json.JSONDecodeError, TypeError):
                    pass

            return [
                origin.strip()
                for origin in v.split(",")
                if origin.strip()
            ]

        return v

    # Database
    DATABASE_URL: str = "sqlite:///./digital_life_navigator.db"

    # AI Provider: 'mock' (default, free) or 'bedrock'
    AI_PROVIDER: str = "mock"

    # Amazon Bedrock Settings
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_SESSION_TOKEN: str = ""
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-haiku-20240307-v1:0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()