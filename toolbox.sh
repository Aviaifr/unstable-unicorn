#!/bin/bash
if [ "$1" == "up" ]; then
    docker-compose up -d
fi
if [ "$1" == "build" ]; then
    docker-compose build
fi
if [[ "$1" == "down" ]]; then
    docker-compose down
fi