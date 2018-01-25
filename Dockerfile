FROM nginx:1.13.7-alpine

ADD template-page/ /usr/share/nginx/html/
COPY virt-host-configs/static.conf /etc/nginx/conf.d/static.conf

#CMD ["nginx"]

