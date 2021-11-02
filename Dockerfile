FROM nginx:1.19.6-alpine

## client config ##
ENV BASE_URL=/

## nginx config ##
ENV NGINX_REAL_IPS_FROM=10.0.0.0/8;172.16.0.0/12;192.168.0.0/16
ENV SOURCE_MAP_ALLOWED_IPS=87.10.0.0/16

COPY ./dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf

COPY docker/bootstrap.sh /bootstrap.sh

ADD https://github.com/kelseyhightower/confd/releases/download/v0.15.0/confd-0.15.0-linux-amd64 /usr/local/bin/confd
RUN chmod +x /usr/local/bin/confd
ADD docker/confd /etc/confd

COPY ./dist/index.html /etc/confd/templates/index.html.tmpl

CMD ["sh", "/bootstrap.sh"]
