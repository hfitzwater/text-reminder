#! /bin/bash

echo '**** Preparing ****'
docker volume create --name=api_db_data
docker volume create --name=redis_db_data
echo '[Done]'

echo '**** Building ****'
$(which docker-compose) build
sleep 1
echo '[Done]'

echo '**** Bringing stack down ****'
$(which docker-compose) down
sleep 1
echo '[Done]'

echo '**** Bringing stack up ****'
$(which docker-compose) up -d
sleep 1
echo '[Done]'
echo 'Finished!'