const path = require('path');
const fs = require('fs/promises');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const MagicString = require('magic-string');

function findType(entries, start) {
  return entries.find(({ offset }) => offset === start);
}

function createUnion(types) {
  return types.join(' | ');
}

async function loadMap() {
  try {
    return require(path.resolve(process.cwd(), './ts-annotate-map.json'));
  } catch (_) {
    throw new Error('Failed to load ts-annotate-map.json');
  }
}

async function apply(files) {
  const map = await loadMap();

  for (const { url, entries } of map) {
    if (!files.includes(url)) continue;

    const code = await fs.readFile(url, 'utf8');
    const ast = parser.parse(code);
    const ms = new MagicString(code);

    traverse(ast, {
      FunctionDeclaration(path) {
        const returnType = findType(entries, path.node.end - 1);
        let funcEnd = path.node.body.start;
        // Explicit support for the common case of a space between ) & {
        if (code[funcEnd - 1] === ' ') {
          funcEnd--;
        }
        if (returnType) {
          let dec = `: ${createUnion(returnType.types)}`;
          ms.appendLeft(funcEnd, dec);
        }

        path.node.params.forEach((param) => {
          const type = findType(entries, param.start);
          if (type) {
            const dec = `: ${createUnion(type.types)}`;
            ms.appendRight(param.end, dec);
          }
        });
      },
    });

    fs.writeFile(url, ms.toString());
  }
}

module.exports = { apply };
