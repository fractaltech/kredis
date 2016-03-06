import {isArray} from 'lodash';

export default class Queue {
  constructor(client, name) {
    this.client = client;
    this.name = name;
  }

  dq() {
    return this.client.dq(this.name);
  }

  nq(...args) {
    if (isArray(args[0])) {
      return this.client.nq(this.name, args[0]);
    } else {
      return this.client.nq(this.name, args);
    }
  }

  range() {
    return this.client.range(this.name);
  }

  clear() {
    return this.client.clear(this.name);
  }
}
