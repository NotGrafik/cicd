const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/index.js');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

test('GET /api/health returns ok with numeric uptime', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.equal(typeof body.uptime, 'number');
});

test('GET /api/hello returns message and version', async () => {
  const res = await fetch(`${baseUrl}/api/hello`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.message, 'Hello from backend');
  assert.equal(typeof body.version, 'string');
});

test('GET /api/hello reflects APP_VERSION env', async () => {
  process.env.APP_VERSION = 'test-1.2.3';
  const res = await fetch(`${baseUrl}/api/hello`);
  const body = await res.json();
  assert.equal(body.version, 'test-1.2.3');
  delete process.env.APP_VERSION;
});

test('unknown route returns 404', async () => {
  const res = await fetch(`${baseUrl}/api/does-not-exist`);
  assert.equal(res.status, 404);
});
