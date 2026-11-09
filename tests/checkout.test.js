const test = require('node:test');
const assert = require('node:assert/strict');

function call(body, method = 'POST') {
  delete require.cache[require.resolve('../api/create-checkout-session.js')];
  const handler = require('../api/create-checkout-session.js');
  const res = { status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  return Promise.resolve(handler({ method, body }, res)).then(() => res);
}

test('checkout function loads and answers without STRIPE_SECRET_KEY', async () => {
  const saved = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  try {
    assert.equal((await call({}, 'GET')).code, 405);
    const res = await call({ products: { figurine: true } });
    assert.equal(res.code, 503);
    assert.equal(res.body.error, 'Checkout is not configured');
  } finally {
    if (saved !== undefined) process.env.STRIPE_SECRET_KEY = saved;
  }
});

test('checkout unit amounts match PRICING_LOCK.md', () => {
  const src = require('node:fs').readFileSync('api/create-checkout-session.js', 'utf8');
  assert.deepEqual(src.match(/unit_amount: \d+/g), ['unit_amount: 8900', 'unit_amount: 3400', 'unit_amount: 4400']);
});
