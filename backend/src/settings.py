from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=False, env_file=Path(__file__).parent / ".." / ".." / ".env"
    )

    products_json: Path = (
        Path(__file__).parent.parent.parent / "database_data" / "products.json"
    )
    database_file_path: Path = (
        Path(__file__).parent.parent.parent / "database_data" / "products.db"
    )
