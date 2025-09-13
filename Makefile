run-linters:
	ruff check --fix backend/
	ruff format backend/

run-migrations:
	docker compose up db_migrate

run-backend-server:
	docker compose up backend

create-first-revision:
	alembic revision --autogenerate -m "initialize database"
	alembic upgrade head
