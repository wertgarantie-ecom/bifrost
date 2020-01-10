#!/bin/bash

DATABASE_NAME=bifrost
POSTGRES_VERSION=12.1
CONTAINER_NAME=bifrost-postgres
IMAGE=postgres:$POSTGRES_VERSION
PORT_MAPPINGS="-p 5432:5432"
POSTGRES_USER=admin
POSTGRES_PASSWORD=bifrost
ENV_VARS="-e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD}"

function remove_container() {
    if [[ ! -z $(docker ps -f name=${CONTAINER_NAME} --format={{.ID}}) ]];
    then
        docker stop ${CONTAINER_NAME}
    fi
    docker rm ${CONTAINER_NAME};
}

function shell() {
    docker exec -it ${CONTAINER_NAME} /bin/bash
}

function psql() {
    docker run -e PGPASSWORD=${POSTGRES_PASSWORD} -it --link bifrost-postgres --rm postgres psql -h bifrost-postgres -U ${POSTGRES_USER}
}

function start() {
    if [[ ! -z $(docker ps -a -f name=${CONTAINER_NAME} --format={{.ID}}) ]];
    then
        remove_container
    fi
    docker run --name ${CONTAINER_NAME} ${PORT_MAPPINGS} $ENV_VARS -d $IMAGE
}

function init() {
    docker exec ${CONTAINER_NAME} bin/bash -c "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -c 'drop database if exists $DATABASE_NAME'"
    docker exec ${CONTAINER_NAME} bin/bash -c "PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -c 'create database $DATABASE_NAME'"
}

function stop() {
    docker stop ${CONTAINER_NAME}
}

function print_usage() {
    echo -e "usage: $0 COMMAND \n";
    echo "   start   pull the configured postgres image and starts a docker container";
    echo "   init    init (drop & re-init) the database"
    echo "   stop    stops the docker container";
    echo "   shell   opens shell in running docker container";
    echo "   psql   opens conencted psql shell";
    echo "   remove_container      removes the docker container";
    echo "   srm     stops and removes the docker container";
}

case "$1" in
    start)
        start
        ;;
    init)
        init
        ;;
    shell)
        shell
        ;;
    psql)
        psql
        ;;
    stop)
        stop
        ;;
    remove_container)
        remove_container
        ;;
    srm)
        stop
        remove_container
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
