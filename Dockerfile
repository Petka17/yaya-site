FROM node:8.12.0-slim as build-site

RUN apt update && apt upgrade && apt install -y python2.7 python-pip
WORKDIR ~/app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN yarn gulp --buildPath dist

FROM nginx:1.13.7-alpine
COPY --from=build-site ~/app/dist /usr/share/nginx/html/
COPY virt-host-configs/static.conf /etc/nginx/conf.d/static.conf
RUN chmod 644 /usr/share/nginx/html/video/*
