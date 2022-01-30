const path = require('path');
const inspector = require('inspector');
const fs = require('fs/promises');

const session = new inspector.Session();
session.connect();

const TS_TYPE_MAP = {
  Function: '(...args: any[]) => any',
  Module: 'Record<string, any>',
  Object: 'Record<string, any>',
  Array: 'any[]',
  Promise: 'Promise<any>',
  Set: 'Set<any>',
  Map: 'Map<any, any>',
  WeakSet: 'WeakSet<any>',
  WeakMap: 'WeakMap<any, any>',
};

function post(method) {
  return new Promise((resolve, reject) => {
    session.post(method, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function run(scriptPath) {
  let exited = false;

  await post('Profiler.enable');
  await post('Profiler.start');
  await post('Profiler.startTypeProfile');

  process.on('beforeExit', async () => {
    if (exited) return;
    exited = true;

    const { result } = await post('Profiler.takeTypeProfile');

    await post('Profiler.stop');

    const filtered = result.map(({ url, entries }) => ({
      url: url.slice('file://'.length),
      entries: entries.map(({ offset, types }) => ({
        offset,
        types: types.map(({ name }) => TS_TYPE_MAP[name] ?? name),
      })),
    }));

    await fs.writeFile(
      path.resolve(process.cwd(), './ts-annotate-map.json'),
      JSON.stringify(filtered, null, 2)
    );
  });

  await import(scriptPath);
}

module.exports = { run };
