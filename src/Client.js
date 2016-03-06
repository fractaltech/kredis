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

  disconnect() {
    return this.ioredis.disconnect();
  }

  set(key, val, lifetime) {
    if (isNumber(lifetime)) {
      return this.ioredis.psetex(key, lifetime, JSON.stringify(val));
    } else {
      return this.ioredis.set(key, JSON.stringify(val));
    }
  }

  put(values, lifetime) {
    return Promise.all(
      Object.keys(values).map((key) => this.set(key, values[key], lifetime))
    );
  }

  get(key, defaultVal=null) {
    if (isArray(key)) {
      return Promise.all(key.map((k) => this.get(k, defaultVal)));
    }

    return this.ioredis.get(key).then((val) => {
      if (val === null) {
        return defaultVal;
      } else {
        return JSON.parse(val);
      }
    });
  }

  exists(key) {
    if (isArray(key)) {
      return Promise.all(key.map((k) => this.exists(k)));
    }

    return this.ioredis.exists(key).then((result) => {
      return result !== 0;
    });
  }

  del(key) {
    if (isArray(key)) {
      return Promise.all(key.map((k) => this.del(k)));
    }

    return this.ioredis.del(key);
  }

  clear(prefix) {
    const ioredisPrefix = this.ioredis.options.keyPrefix;
    const pattern = isString(prefix) ? `${prefix}*` : `*`;

    return this.ioredis.clear(`${ioredisPrefix}${pattern}`);
  }

  range(queue, startI=0, endI=-1) {
    return this.ioredis.lrange(queue, startI, endI)
      .then((items) => items.map((item) => JSON.parse(item)));
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
