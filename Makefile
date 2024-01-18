all :
	docker-compose stop && docker-compose up --build -d --remove-orphans && docker-compose logs -f

$(NAME) :
	docker-compose stop && docker-compose up --build -d --remove-orphans

clean :
	docker rm -f backend pgadmin-portal frontend bp-pg-db

fclean : clean
	docker rmi -f ft_transcendance-backend dpage/pgadmin4 postgres:12-alpine ft_transcendance-frontend

re : fclean all