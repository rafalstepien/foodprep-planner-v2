from dependency_injector import containers, providers

from .database import DatabaseClient


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            ".api.endpoints",
        ]
    )

    config = providers.Configuration()

    db_client = providers.Factory(DatabaseClient, config.database_file_path)
