#!/bin/bash
NAME=docker-puppeteer
DIR=$(dirname "$(realpath "$0")")
APP_DIR=$(dirname "$DIR")

docker build -t $NAME -f $APP_DIR/Dockerfile $APP_DIR