'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = defaultCommands;

function defaultCommands(ioredis) {

  ioredis.defineCommand('clear', {
    numberOfKeys: 0,
    lua: '\nlocal keys = redis.call("keys", ARGV[1])\nfor i=1,#keys,5000 do\n    redis.call("del", unpack(keys, i, math.min(i+4999, #keys)))\nend\nreturn keys\n'
  });
}

module.exports = exports['default'];