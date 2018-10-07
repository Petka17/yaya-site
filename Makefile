PROJECT_NAME := yaya-site
DOCKER_REGISTRY := registry.yaya-dev.ru

.PHONY: all build push

all: build push

build:
	docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}:${GIT_BRANCH} .

push:
	docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}:${GIT_BRANCH}

test:
	docker run -p 8080:80 -v /data/static/logs/ ${DOCKER_REGISTRY}/${PROJECT_NAME}:${GIT_BRANCH}