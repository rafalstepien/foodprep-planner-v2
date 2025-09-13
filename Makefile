run-linters:
	ruff check --fix backend/
	ruff format backend/

run-migrations:
	docker compose up db_migrate

run-backend-server:
	docker compose up backend
