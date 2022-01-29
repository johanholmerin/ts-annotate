# ts-annotate

Add TypeScript declarations based on v8 runtime profiling

## Instructions

```sh
# 1. Generate type data by running the code
npx ts-annotate run ./index.js

# 2. Add type declaration to source code
npx ts-annotate apply ./src/**/*.js
```

## Supported types

- Primitives - `string`, `number`, `boolean`, etc.
- Class instances(includes arrays, objects, promises, etc.)
- Functions(i.e. callbacks)

Only simple types are inferred - objects are `Record<string, any>`, arrays
`any[]`, and functions `(...args: any[]) => any`.

## Commands

- `run` - Same as running `node ./index.js` but saves type data to `ts-annotate-map.json`
- `apply` - Adds type declarations to the specified files using data in `ts-annotate-map.json`

## Passing flags to Node

```sh
node --flag ./node_modules/.bin/ts-annotate ...
```

## Prior work

- https://github.com/fhinkel/type-profile
