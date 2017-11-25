#!/usr/bin/env bash

set -e

yarn
cd extension && yarn && cd ..
cd server && yarn && cd ..
yarn lint

cd extension
yarn build
yarn build-zip
cd ..

cd server
yarn stop
yarn start
cd ..