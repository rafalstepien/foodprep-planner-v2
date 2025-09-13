"""prepopulate products table

Revision ID: 71b58577de58
Revises: e06e07bc7c4f
Create Date: 2025-09-13 17:22:28.636617

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from backend.src.database import DatabaseClient
from backend.src.settings import Settings


# revision identifiers, used by Alembic.
revision: str = '71b58577de58'
down_revision: Union[str, Sequence[str], None] = 'e06e07bc7c4f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    settings = Settings()
    db_client = DatabaseClient(settings.database_file_path)
    db_client.populate_products_table(settings.products_json)


def downgrade() -> None:
    """Downgrade schema."""
    pass
