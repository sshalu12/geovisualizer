run:
	@docker-compose up

refresh:
	@docker exec -it postgres sh /opt/refresh/setup.sh
