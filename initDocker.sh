#!/bin/bash

if [[ $1 == "init" ]] ; then
    echo "initializing docker"
    docker compose -f backend/compose.yaml up -d
    docker compose -f frontend/compose.yaml up -d
else
    echo "stopping docker"
    docker compose -f backend/compose.yaml stop
    docker compose -f frontend/compose.yaml stop
fi