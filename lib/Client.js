'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _lodash = require('lodash');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _Queue = require('./Queue');

var _Queue2 = _interopRequireDefault(_Queue);

var _Hash = require('./Hash');

var _Hash2 = _interopRequireDefault(_Hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = (function () {
  function Client(config) {
    _classCallCheck(this, Client);

    this.ioredis = config instanceof _ioredis2.default ? config : new _ioredis2.default(config);
    (0, _commands2.default)(this.ioredis);
  }

  _createClass(Client, [{
    key: 'connect',
    value: function connect() {
      return this.ioredis.connect();
    }
  }, {
    key: 'quit',
    value: function quit() {
      return this.ioredis.quit();
    }
  }, {
    key: 'set',
    value: function set(key, val, lifetime) {
      if ((0, _lodash.isNumber)(lifetime)) {
        return this.ioredis.set(key, JSON.stringify(val));
      } else {
        return this.ioredis.psetex(key, lifetime, JSON.stringify(val));
      }
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.ioredis.get(key).then(function (val) {
        return JSON.parse(val);
      });
    }
  }, {
    key: 'del',
    value: function del(key) {
      return this.ioredis.del(key);
    }
  }, {
    key: 'clear',
    value: function clear(prefix) {
      return this.ioredis.clear((0, _lodash.isString)(prefix) ? prefix : '');
    }
  }, {
    key: 'nq',
    value: function nq(queue, vals) {
      if ((0, _lodash.isArray)(vals)) {
        vals = vals.map(function (v) {
          return JSON.stringify(v);
        });
      } else {
        vals = JSON.stringify(vals);
      }

      return this.ioredis.rpush(queue, vals);
    }
  }, {
    key: 'dq',
    value: function dq(queue) {
      return this.ioredis.lpop(queue).then(function (val) {
        return JSON.parse(val);
      });
    }
  }, {
    key: 'queue',
    value: function queue(name) {
      return new _Queue2.default(this, name);
    }
  }, {
    key: 'hash',
    value: function hash(name) {
      return new _Hash2.default(this, name);
    }
  }]);

  return Client;
})();

exports.default = Client;