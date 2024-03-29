.PHONY: stop-containers remove-containers remove-images stop all

all:
	chmod +x ./shared.sh && ./shared.sh
	docker compose up -d


studio:
	docker exec -ti back npx prisma studio

restart:
	docker stop `docker ps -q`
	docker start `docker ps -aq`

stop:
	docker stop `docker ps -q`
	
start:
	docker start `docker ps -aq`

deletemodules:
	find . -maxdepth 2  -name  "node_modules" -exec rm -rf {} \;

deletedist:
	find . -maxdepth 2  -name  "dist" -exec rm -rf {} \;

fclean:
	./stop.sh

re : fclean all
