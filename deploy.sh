#!/usr/bin/env bash

set -e

yarn
yarn lint

cd extension
yarn
yarn build
yarn build-zip
cd ..

cd server
yarn
yarn stop
yarn start