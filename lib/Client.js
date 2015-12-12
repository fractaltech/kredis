'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _lodash = require('lodash');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _Queue = require('./Queue');

var _Queue2 = _interopRequireDefault(_Queue);

var _Hash = require('./Hash');

var _Hash2 = _interopRequireDefault(_Hash);

var Client = (function () {
  function Client(config) {
    _classCallCheck(this, Client);

    this.ioredis = config instanceof _ioredis2['default'] ? config : new _ioredis2['default'](config);
    (0, _commands2['default'])(this.ioredis);
  }

  _createClass(Client, [{
    key: 'connect',
    value: function connect() {
      return this.ioredis.connect();
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      return this.ioredis.disconnect();
    }
  }, {
    key: 'set',
    value: function set(key, val, lifetime) {
      if ((0, _lodash.isNumber)(lifetime)) {
        return this.ioredis.psetex(key, lifetime, JSON.stringify(val));
      } else {
        return this.ioredis.set(key, JSON.stringify(val));
      }
    }
  }, {
    key: 'put',
    value: function put(values, lifetime) {
      var _this = this;

      return Promise.all(Object.keys(values).map(function (key) {
        return _this.set(key, values[key], lifetime);
      }));
    }
  }, {
    key: 'get',
    value: function get(key) {
      var _this2 = this;

      var defaultVal = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if ((0, _lodash.isArray)(key)) {
        return Promise.all(key.map(function (k) {
          return _this2.get(k, defaultVal);
        }));
      }

      return this.ioredis.get(key).then(function (val) {
        if (val === null) {
          return defaultVal;
        } else {
          return JSON.parse(val);
        }
      });
    }
  }, {
    key: 'exists',
    value: function exists(key) {
      var _this3 = this;

      if ((0, _lodash.isArray)(key)) {
        return Promise.all(key.map(function (k) {
          return _this3.exists(k);
        }));
      }

      return this.ioredis.exists(key).then(function (result) {
        return result !== 0;
      });
    }
  }, {
    key: 'del',
    value: function del(key) {
      var _this4 = this;

      if ((0, _lodash.isArray)(key)) {
        return Promise.all(key.map(function (k) {
          return _this4.del(k);
        }));
      }

      return this.ioredis.del(key);
    }
  }, {
    key: 'clear',
    value: function clear(prefix) {
      var ioredisPrefix = this.ioredis.options.keyPrefix;
      var pattern = (0, _lodash.isString)(prefix) ? prefix + '*' : '*';

      return this.ioredis.clear('' + ioredisPrefix + pattern);
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
      return new _Queue2['default'](this, name);
    }
  }, {
    key: 'hash',
    value: function hash(name) {
      return new _Hash2['default'](this, name);
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];