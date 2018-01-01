#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

cd "../packages/extension"

yarn test

test -f dist/manifest.json
test -f dist/background.js
test -f dist/popup/popup.js

EXTENSION_VERSION=$(node -pe "require('../../lerna.json').version")
test -f "dist-zip/Solary-v$EXTENSION_VERSION.zip"
