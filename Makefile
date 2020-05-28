run:
	docker-compose up --build -d

re-run:
	docker-compose down
	docker rmi site-art_nginx site-art_site_art
	docker-compose up --build -d

stop:
	docker-compose down
	docker rmi site-art_nginx site-art_site_art

