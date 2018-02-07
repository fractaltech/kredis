import assert from 'assert';

import Client from '../src/Client';

import config from './config';

import testClient from './testClient';
import testHash from './testHash';
import testQueue from './testQueue';

// handle promise errors
process.on('unhandledRejection', err => { throw err; });

run(...process.argv.slice(2));

async function run(password) {
  const client = new Client({...config.redis, password});

  await client.clear();

  await testClient(assert, client);
  await testHash(assert, client);
  await testQueue(assert, client);
  await client.disconnect();
}
