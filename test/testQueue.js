export default async function run(assert, client) {
  console.log('testing queue');

  const q = client.queue('q');

  await q.nq({x: 1}, {x: 2});
  await q.nq([{x: 3}, {x: 4}]);

  assert.deepEqual((await q.dq()).x, 1);
  assert.deepEqual((await q.dq()).x, 2);
  assert.deepEqual((await q.dq()).x, 3);
  assert.deepEqual((await q.dq()).x, 4);
  assert.deepEqual(await q.dq(), null);
}
