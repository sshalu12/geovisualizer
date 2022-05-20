run:
	@docker-compose up

refresh:
	@docker exec -it postgres sh /opt/refresh/setup.sh

run-poi:
	@docker compose run python ./app/wait-for-postgres.sh postgres python ./app/poi.py

run-state:
	@docker compose run python ./app/wait-for-postgres.sh postgres python ./app/state.py

run-api:
	@docker compose up web
