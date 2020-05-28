run:
	sudo docker-compose up --build -d

re-run:
	sudo docker-compose down
	sudo docker rmi site-art_nginx site-art_site_art
	sudo docker-compose up --build -d

stop:
	sudo docker-compose down
	sudo docker rmi site-art_nginx site-art_site_art

