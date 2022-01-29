#!/usr/bin/env node
const fs = require('fs/promises');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const MagicString = require('magic-string');

function findType(entries, start) {
  return entries.find(({ offset }) => offset === start);
}

async function main() {
  const map = require(process.argv[2]);

  for (const { url, entries } of map) {
    const code = await fs.readFile(url, 'utf8');
    const ast = parser.parse(code);
    const ms = new MagicString(code);

    traverse(ast, {
      FunctionDeclaration(path) {
        path.node.params.forEach((param) => {
          const type = findType(entries, param.start);
          if (type) {
            const dec = `: ${type.types.join(' | ')}`;
            ms.appendRight(param.end, dec);
          }
        });
      },
    });

    fs.writeFile(url, ms.toString());
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
