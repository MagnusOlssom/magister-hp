#!/bin/sh
# Startar utvecklingsservern.
# Faller tillbaka på den lokala Node-installationen om npm saknas i PATH.
if ! command -v npm >/dev/null 2>&1; then
  export PATH="$HOME/Claude/.tools/node-v22.14.0-darwin-arm64/bin:$PATH"
fi
cd "$(dirname "$0")" && npm run dev
