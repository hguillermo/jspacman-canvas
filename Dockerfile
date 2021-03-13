FROM ubuntu

RUN apt-get update

RUN apt-get install nginx -y

COPY index.html /var/www/html/

COPY game.min.js /var/www/html/

ADD media /var/www/html/media/

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
