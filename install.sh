sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo git clone https://github.com/MariaZyryanova72/site-ART
sudo touch /usr/src/app/logs/nginx-access.log
sudo touch /usr/src/app/log/nginx-error.log
sudo touch /usr/src/app/log/gunicorn-access.log
sudo touch /usr/src/app/log/gunicorn-error.log
sudo docker-compose up -d