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

function getFuncEnd(code, node) {
  let funcEnd = node.body.start;

  if (node.type === 'ArrowFunctionExpression') {
    while (code[funcEnd] !== '=' && code[funcEnd + 1] !== '>') {
      funcEnd--;
    }
  }

  // Explicit support for the common case of a space between ) & {
  if (code[funcEnd - 1] === ' ') {
    funcEnd--;
  }

  return funcEnd;
}

function needParens(code, node) {
  return (
    node.type === 'ArrowFunctionExpression' &&
    node.params.length === 1 &&
    code[node.start] !== '('
  );
}

async function apply(files) {
  const map = await loadMap();

  for (const { url, entries } of map) {
    if (!files.includes(url)) continue;

    const code = await fs.readFile(url, 'utf8');
    const ast = parser.parse(code, {
      sourceType: 'module',
    });
    const ms = new MagicString(code);

    function addFuncTypes({ node }) {
      const returnType = findType(entries, node.end - 1);
      const funcEnd = getFuncEnd(code, node);
      if (returnType) {
        const dec = `: ${createUnion(returnType.types)}`;
        ms.appendLeft(funcEnd, dec);
      }

      if (needParens(code, node)) {
        ms.appendLeft(node.start, '(');
        ms.appendRight(node.params[0].end, ')');
      }

      node.params.forEach((param) => {
        let paramPosition = param.start;
        let typePosition = param.end;
        if (param.type === 'AssignmentPattern') {
          paramPosition = param.end - 1;
          typePosition = param.left.end;
        }
        const type = findType(entries, paramPosition);
        if (type) {
          const dec = `: ${createUnion(type.types)}`;
          ms.appendRight(typePosition, dec);
        }
      });
    }

    traverse(ast, {
      FunctionDeclaration: addFuncTypes,
      FunctionExpression: addFuncTypes,
      ArrowFunctionExpression: addFuncTypes,
    });

    fs.writeFile(url, ms.toString());
  }
}

module.exports = { apply };
