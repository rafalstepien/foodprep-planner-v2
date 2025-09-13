run-linters:
	ruff check --fix backend/
	ruff format backend/

run-migrations:
	docker compose up db_migrate

run-backend-server:
	docker compose up backend


REVISION_TEXT="..."

create-revision:
	alembic revision -m "$(REVISION_TEXT)"


# create first revision
# alembic revision --autogenerate -m "initialize and prepopulate"
