const test = require('node:test');
const assert = require('node:assert/strict');
const { FakeDocument, createBaseContext, loadScript } = require('./html-script-test-utils');

function createProductionHarness({ withClipboard = false } = {}) {
  const document = new FakeDocument({
    toast: { className: '' },
  });

  const context = createBaseContext(document, {
    navigator: withClipboard ? { clipboard: { writeText: async () => {} } } : {},
  });

  const exports = loadScript('public/production.html', context, ['copyBlock']);
  return { document, context, ...exports };
}

test('production copyBlock uses the clipboard fallback when needed', async () => {
  const { document, copyBlock } = createProductionHarness();

  await copyBlock();

  assert.deepEqual(document.execCommandCalls, ['copy']);
  assert.equal(document.body.children.length, 0);
  assert.equal(document.getElementById('toast').classList.contains('show'), false);
});
