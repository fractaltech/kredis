const IORedis = require('ioredis');
const {isString, isNumber, isArray} = require('lodash');

const Connection = require('./Connection');
const defaultCommands = require('./commands');
const Queue = require('./Queue');
const Hash = require('./Hash');

class Client {
  constructor(config) {
    this.connection = new Connection(config);
  }

  disconnect() {
    return this.connection.quit();
  }

  set(key, val, lifetime) {
    if (isNumber(lifetime)) {
      return this.connection.cmds.psetex(key, lifetime, JSON.stringify(val));
    } else {
      return this.connection.cmds.set(key, JSON.stringify(val));
    }
  }

  put(values, lifetime) {
    return Promise.all(
      Object.keys(values).map((key) => this.connection.cmds.set(key, values[key], lifetime))
    );
  }

  get(key, defaultVal=null) {
    if (isArray(key)) {
      return Promise.all(key.map((k) => this.get(k, defaultVal)));
    }

    return this.connection.cmds.get(key).then((val) => {
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

    return this.connection.cmds.exists(key).then((result) => {
      return Number(result) !== 0;
    });
  }

  del(key) {
    if (isArray(key)) {
      return Promise.all(key.map((k) => this.del(k)));
    }

    return this.connection.cmds.del(key);
  }

  delete(key) {
    return this.del(key);
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

module.exports = Client;
