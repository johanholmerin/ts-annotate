#!/usr/bin/env bash

set -e

shopt -s nullglob

for dir in ./tests/${1:-*}; do
  (
    cd "$dir"
    cp ./input.js ./output.ts
    ../../bin/ts-annotate run ./output.ts
    ../../bin/ts-annotate apply ./output.ts
    diff ./output.ts ./expected.ts
  )
done
