'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var Hash = (function () {
  function Hash(client, name) {
    _classCallCheck(this, Hash);

    this.client = client;
    this.name = name;
  }

  _createClass(Hash, [{
    key: 'fullKey',
    value: function fullKey(key) {
      var _this = this;

      if ((0, _lodash.isArray)(key)) {
        return key.map(function (k) {
          return _this.fullKey(k);
        });
      }

      return this.name + '.' + key;
    }
  }, {
    key: 'assign',
    value: function assign(values, lifetime) {
      var _this2 = this;

      return Promise.all(Object.keys(values).map(function (key) {
        return _this2.set(key, values[key], lifetime);
      }));
    }
  }, {
    key: 'has',
    value: function has(key) {
      return this.client.exists(this.fullKey(key));
    }
  }, {
    key: 'get',
    value: function get(key) {
      var defaultVal = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      return this.client.get(this.fullKey(key), defaultVal);
    }
  }, {
    key: 'set',
    value: function set(key, val, lifetime) {
      return this.client.set(this.fullKey(key), val, lifetime);
    }
  }, {
    key: 'del',
    value: function del(key) {
      return this.client.del(this.fullKey(key));
    }
  }, {
    key: 'delete',
    value: function _delete(key) {
      return this['delete'](key);
    }
  }, {
    key: 'clear',
    value: function clear() {
      return this.client.clear(this.name + '.');
    }
  }]);

  return Hash;
})();

exports['default'] = Hash;
module.exports = exports['default'];