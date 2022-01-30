# ts-annotate

Automatically add TypeScript declaration based on actual types passed at runtime, as determined by [V8][v8-profiling].

## Example

#### Before

```javascript
function add(a, b) {
  return a + b;
}

add(1, 2);
```

#### After

```javascript
function add(a: number, b: number): number {
  return a + b;
}

add(1, 2);
```

## Instructions

```sh
# 1. Generate type data by running the code
npx ts-annotate run ./index.js

# 2. Add type declaration to source code
npx ts-annotate apply ./src/**/*.js

# 3. Rename .js to .ts
# 4. Cleanup/improve types
```

## Supported types

- Primitives - `string`, `number`, `boolean`, etc.
- Class instances(includes arrays, objects, promises, etc.)
- Functions(i.e. callbacks)

Only simple types are inferred - objects are `Record<string, any>`, arrays
`any[]`, and functions `(...args: any[]) => any`.

## Commands

- `run` - Same as running `node` but saves type data to `ts-annotate-map.json`
- `apply` - Adds type declarations to the specified files using data in `ts-annotate-map.json`

## Passing flags to Node

```sh
node --flag ./node_modules/.bin/ts-annotate ...
```

## Prior work

- https://github.com/fhinkel/type-profile

[v8-profiling]: https://docs.google.com/document/d/1JY7pUCAk8gegyi6UkIdln6j_AeJqQucZg92advaMJY4/edit
