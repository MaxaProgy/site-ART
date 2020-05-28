FROM python:3.7

RUN mkdir -p /usr/src/app/
RUN mkdir -p /var/log/gunicorn/
WORKDIR /usr/src/app/
COPY . /usr/src/app/

RUN pip install --no-cache-dir -r requirements.txt


