#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

cd "../packages/server"

# Generate SSL certificate
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 1 -keyout localhost.key -out localhost.crt \
		-subj "/C=FR/ST=France/L=Lyon/CN=localhost"

cat >config.js <<EOL
module.exports = {
  cert: '${PWD}/localhost.crt',
  key: '${PWD}/localhost.key',
};
EOL

# Generate .htpasswd
echo "test:\$apr1\$5/dYaSP9\$mVdB6dbv6dlyCRhhQhtDN1" > .htpasswd

# Start server
yarn stop
yarn start
sleep 5
