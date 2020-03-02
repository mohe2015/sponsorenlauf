#!/bin/sh
cd server
yarn
yarn run generate
cd ..

cd client
yarn
yarn run relay
