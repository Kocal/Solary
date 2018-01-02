#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check pm2
npx pm2 log --nostream
npx pm2 info solary
test $? = 0

# Check connection
RESPONSE=$(curl https://localhost:3000 --insecure)
test $? = 0;
test "${RESPONSE}" = "401 Unauthorized" # .htpasswd

# Check websocket
set +e # timeout command will exit with status != 124, so it will stop script execution
WEBSOCKET_RESPONSE=$(NODE_TLS_REJECT_UNAUTHORIZED=0 timeout 1s npx wsc -er wss://localhost:3000)
sleep 2
test $? = 124 # timeout
set -e # re-enable error control

echo ${WEBSOCKET_RESPONSE} | grep "Connected to WebSocket server."
test $? = 0
