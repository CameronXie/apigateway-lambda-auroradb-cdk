CONTAINER=cdk_node

up:
	@make start-containers

down:
	@make stop-containers

start-containers:
	@docker-compose up --build -d

stop-containers:
	@docker-compose down -v

sh:
	@docker exec -it ${CONTAINER} sh
