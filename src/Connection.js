const redisdsl = require('redisdsl');
const {assign} = require('lodash');

class Connection {
  constructor(config) {
    const {
      client,
      psetex,
      set,
      get,
      lpop,
      clear,
      lrange,
      del,
      exists
    } = redisdsl(config);

    this.client = client;

    this.cmds = assign({
      psetex,
      set,
      get,
      lpop,
      clear,
      lrange,
      del,
      exists
    });
  } 

  quit() {
    return this.client.quit();
  } 
}

module.exports = Connection;
