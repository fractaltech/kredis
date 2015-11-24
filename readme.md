# kredis

<h2>A wrapper over <a href="https://github.com/luin/ioredis" target="_blank">ioredis</a> with most used redis functionalities</h2>


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

client.quit();
// call when you want to quit. returns a promise

client.set(key, val, lifetime);
// set a value in redis for a particular lifetime in milliseconds
// sets the value permanently if no lifetime is provided
// client.set('foo', {x: 1, y: 2}, 10000);
// returns a promise

client.get(key)
// get a value from redis
// returns a promise wrapping the JSON.parsed value

client.del(key)
// delete a key from redis
// returns a promise

client.clear(prefix)
// clear all keys with a certain prefix
// returns promise

client.nq(queue, vals)
// vals can be array or object
// enqueues the vals in a queue stored with key `queue`
// useful for simple communication b/w servers
// returns a promise

client.dq(queue)
// dequeue the queue named `queue`
// returns a promise

const tasksQueue = client.queue('tasks');
tasksQueue.nq(task);
tasksQueue.dq();
tasksQueue.clear();
// simply a shorthand for working with a queue

const usersHash = client.hash('users');
usersHash.set(user.id, user);
usersHash.del(user.id);
usersHash.clear();
// simply a shorthand for working with a namespaced key-value store
// in redis

```
