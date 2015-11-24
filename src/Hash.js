export default class Hash {
  constructor(client, name) {
    this.client = client;
    this.name = name;
  }

  fullKey(key) {
    return [this.name, key].join('.');
  }

  get(key) {
    return this.client.get(this.fullKey(key));
  }

  set(key, val, lifetime) {
    return this.client.set(this.fullKey(key), val, lifetime);
  }

  del(key) {
    return this.client.del(this.fullKey(key));
  }

  clear() {
    return this.client.clear(this.name);
  }
}
