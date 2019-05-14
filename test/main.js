const assert = require('assert');
const Client = require('../src/Client');

const config = require('./config');

const testClient = require('./testClient');
const testHash = require('./testHash');
const testQueue = require('./testQueue');

// handle promise errors
process.on('unhandledRejection', err => { throw err; });

run(...process.argv.slice(2));

async function run() {
  const client = new Client(config.redis);

  await client.clear();

  await testClient(assert, client);
  await testHash(assert, client);
  await testQueue(assert, client);
  await client.disconnect();
}
