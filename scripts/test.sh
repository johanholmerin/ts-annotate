#!/usr/bin/env bash

set -e

shopt -s nullglob

for dir in ./tests/*; do
  (
    cd "$dir"
    cp ./input.js ./output.ts
    ../../bin/ts-annotate run ./output.ts
    ../../bin/ts-annotate apply ./output.ts
    diff ./output.ts ./expected.ts
  )
done
