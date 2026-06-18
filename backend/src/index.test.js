const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('./index');

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => server.close());

test('GET /api/health returns ok', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
  assert.strictEqual(typeof body.uptime, 'number');
});

test('GET /api/hello returns message', async () => {
  const res = await fetch(`${base}/api/hello`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.message, 'Hello from backend');
});

test('unknown route returns 404', async () => {
  const res = await fetch(`${base}/api/nope`);
  assert.strictEqual(res.status, 404);
});
