PROJECT_NAME := yaya-site
DOCKER_REGISTRY := registry.yaya-dev.ru

.PHONY: all build push

all: build push

build:
	docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME} .

push:
	docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}
