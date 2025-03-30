#!/bin/bash
CONTAINER=docker-puppeteer
NAME=$CONTAINER-test
DIR=$(dirname $(realpath "$0"))
APP_DIR=$(dirname "$DIR")
SECCOMP_FILE=$APP_DIR/securityOpts.json

# Existing container
if [ "$(docker ps -a | grep "$NAME")" ]; then 
  docker rm -f "$NAME"
fi

# Volume
# if [ ! "$(docker volume ls | grep $VOLUME)" ]; then
#   docker volume create $VOLUME
# fi

docker run -d \
--name $NAME \
--restart unless-stopped \
-e PORT=3000 \
-e MAX_BROWSERS=2 \
-e TZ=Europe/Tallinn \
-p 5000:3000 \
--security-opt seccomp=$SECCOMP_FILE \
--shm-size=2g \
$CONTAINER


