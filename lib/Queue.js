'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = (function () {
  function Queue(client, name) {
    _classCallCheck(this, Queue);

    this.client = client;
    this.name = name;
  }

  _createClass(Queue, [{
    key: 'dq',
    value: function dq() {
      return this.client.dq(this.name);
    }
  }, {
    key: 'nq',
    value: function nq() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if ((0, _lodash.isArray)(args[0])) {
        return this.client.nq(this.name, args[0]);
      } else {
        return this.client.nq(this.name, args);
      }
    }
  }, {
    key: 'clear',
    value: function clear() {
      return this.client.clear(this.name);
    }
  }]);

  return Queue;
})();

exports.default = Queue;