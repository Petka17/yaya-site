PROJECT_NAME := yaya-site
DOCKER_REGISTRY := registry.yaya-dev.ru
current_dir = $(shell pwd)

.PHONY: all build push

all: build push

build:
	docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}:${GIT_BRANCH} .

push:
	docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}:${GIT_BRANCH}

watch:
	docker run -p 8080:80 --rm -d -v /data/static/logs/ -v ${current_dir}/dist:/usr/share/nginx/html nginx:1.13.7-alpine && \
	yarn gulp watch --buildPath=dist