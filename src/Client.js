import IORedis from 'ioredis';
import {isString, isNumber, isArray} from 'lodash';

import defaultCommands from './commands';
import Queue from './Queue';
import Hash from './Hash';

export default class Client {
  constructor(config) {
    this.ioredis = config instanceof IORedis ? config : new IORedis(config);
    defaultCommands(this.ioredis);
  }

  connect() {
    return this.ioredis.connect();
  }

  quit() {
    return this.ioredis.quit();
  }

  set(key, val, lifetime) {
    if (isNumber(lifetime)) {
      return this.ioredis.set(key, JSON.stringify(val));
    } else {
      return this.ioredis.psetex(key, lifetime, JSON.stringify(val));
    }
  }

  get(key) {
    return this.ioredis.get(key).then((val) => JSON.parse(val));
  }

  del(key) {
    return this.ioredis.del(key);
  }

  clear(prefix) {
    return this.ioredis.clear(isString(prefix) ? prefix : '');
  }

  nq(queue, vals) {
    if (isArray(vals)) {
      vals = vals.map((v) => JSON.stringify(v));
    } else {
      vals = JSON.stringify(vals);
    }

    return this.ioredis.rpush(queue, vals);
  }

  dq(queue) {
    return this.ioredis.lpop(queue).then((val) => {
      return JSON.parse(val);
    });
  }

  queue(name) {
    return new Queue(this, name);
  }

  hash(name) {
    return new Hash(this, name);
  }
}
