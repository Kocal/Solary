#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

cd "../packages/server"

yarn stop

rm localhost.crt
rm localhost.key
