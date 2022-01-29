#!/usr/bin/env node
const inspector = require('inspector');

const session = new inspector.Session();
session.connect();

const TS_TYPE_MAP = {
  Function: '(...args: any[]) => any',
  Module: 'Record<string, any>',
  Object: 'Record<string, any>',
  Array: 'any[]',
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

async function main() {
  await post('Profiler.enable');
  await post('Profiler.start');
  await post('Profiler.startTypeProfile');

  process.on('beforeExit', async () => {
    const { result } = await post('Profiler.takeTypeProfile');

    await post('Profiler.stop');

    const filtered = result
      .filter(({ url }) => url.startsWith(`file://${process.cwd()}`))
      .map(({ url, entries }) => ({
        url: url.slice('file://'.length),
        entries: entries.map(({ offset, types }) => ({
          offset,
          types: types.map(({ name }) => TS_TYPE_MAP[name] ?? name),
        })),
      }));

    console.log(JSON.stringify(filtered, null, 2));
  });

  require(process.argv[2]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
