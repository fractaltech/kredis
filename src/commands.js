function defaultCommands(ioredis) {

  ioredis.defineCommand('clear', {
    numberOfKeys: 0,
    lua: `
local keys = redis.call("keys", ARGV[1])
for i=1,#keys,5000 do
    redis.call("del", unpack(keys, i, math.min(i+4999, #keys)))
end
return keys
`
  });

}

module.exports = defaultCommands;
