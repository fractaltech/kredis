# kredis v 1.0.3
#### We follow (breaking).(feature).(fix) versioning

## A wrapper over [ioredis](https://github.com/luin/ioredis) with most used redis functionalities


### Usage:

```js
import KRedis from 'kredis';

const client = new KRedis({
  host: 'localhost',
  port: '6379',
  keyPrefix: 'app.'
});

// API

client.connect();
// optional, returns a promise

client.disconnect();
// call when you want to disconnect. returns a promise

client.set(key, val, lifetime);
// set a value in redis for a particular lifetime in MILLISECONDS
// sets the value permanently if no lifetime is provided
// client.set('foo', {x: 1, y: 2}, 10000);
// returns a promise

client.put(values, lifetime);
// here values is an object of the form:
// {key1: val1, key2: val2 ...and so on}
// lifetime is optional

client.get(key)
// get a value from redis
// returns a promise wrapping the JSON.parsed value

client.get(arrayOfKeys)
// get values from redis for an array of keys
// returns a promise wrapping the JSON.parsed values

client.del(key)
// delete a key from redis
// returns a promise

client.del(arrayOfKeys)
// delete an array of keys from redis
// returns a promise

client.clear(prefix)
// clear all keys with a certain prefix
// honors keyPrefix from connection config
// returns promise

client.nq(queue, vals)
// vals can be array or object
// enqueues the vals in a queue stored with key `queue`
// useful for simple communication b/w servers
// returns a promise

client.range(queue)
// returns all the items in the queue

client.dq(queue)
// dequeue the queue named `queue`
// returns a promise

const tasksQueue = client.queue('tasks');
tasksQueue.nq(task);
tasksQueue.range();
tasksQueue.dq();
tasksQueue.clear();
// simply a shorthand for working with a queue

const usersHash = client.hash('users');
usersHash.set(user.id, user);
usersHash.del(user.id);
usersHash.clear();
// simply a shorthand for working with a namespaced key-value store

```

### Testing
1. Copy `test/config.sample.js` to `test/config.js`. Make changes as needed
2. Run `npm run test`
