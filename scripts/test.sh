#!/usr/bin/env bash

set -e

shopt -s nullglob

for dir in ./tests/*; do
  (
    cd "$dir"
    cp ./input.js ./output.js
    ../../bin/ts-annotate run ./output.js
    ../../bin/ts-annotate apply ./output.js
    diff ./output.js ./expected.ts
  )
done
