const test = require('node:test');
const assert = require('node:assert/strict');
const { FakeDocument, FakeElement, createBaseContext, loadScript } = require('./html-script-test-utils');

function createRunnerHarness({ withClipboard = false } = {}) {
  const document = new FakeDocument({
    orderId: { value: 'GRAD-001' },
    gradName: { value: 'Avery' },
    grade: { value: '8th' },
    school: { value: 'North Ridge' },
    favMemory: { value: 'Winning the robotics fair' },
    challenge: { value: 'Recovering after an injury' },
    proudMoment: { value: 'Giving the graduation speech' },
    futureGoal: { value: 'Becoming an engineer' },
    personality: { value: 'Curious, kind, resilient' },
    funFact: { value: 'Builds robots from scrap parts' },
    dedication: { value: 'Keep shining brightly.' },
    outputTitle: { textContent: '' },
    emptyState: { style: { display: 'block' } },
    outputText: { value: '', style: { display: 'none' } },
    copyBtn: { textContent: 'Copy Prompt', className: 'copy-btn' },
    toast: { className: '' },
  });

  ['watercolor', 'graphic', 'classic'].forEach((value, index) => {
    document.registerElement(new FakeElement(`story-${index}`, { className: 'style-btn', dataset: { group: 'story', val: value } }));
  });
  ['manga', 'superhero', 'cartoon'].forEach((value, index) => {
    document.registerElement(new FakeElement(`comic-${index}`, { className: 'style-btn', dataset: { group: 'comic', val: value } }));
  });

  const context = createBaseContext(document, {
    navigator: withClipboard ? { clipboard: { writeText: async () => {} } } : {},
  });

  const exports = loadScript('public/runner.html', context, [
    'selectedStyles', 'selectStyle', 'fillTemplate', 'generatePrompt', 'copyOutput', 'showToast'
  ]);

  return { document, context, ...exports };
}

test('runner generatePrompt fills the selected template with order data', () => {
  const { document, selectStyle, generatePrompt } = createRunnerHarness();

  selectStyle(document.getElementById('story-0'));
  generatePrompt('story');

  assert.match(document.getElementById('outputTitle').textContent, /STORYBOOK — WATERCOLOR/);
  assert.match(document.getElementById('outputText').value, /Avery/);
  assert.match(document.getElementById('outputText').value, /GRAD-001/);
  assert.equal(document.getElementById('emptyState').style.display, 'none');
  assert.equal(document.getElementById('outputText').style.display, 'block');
});

test('runner copyOutput falls back to execCommand when clipboard API is unavailable', async () => {
  const { document, copyOutput } = createRunnerHarness();
  document.getElementById('outputText').value = 'Prompt text';

  await copyOutput();

  assert.deepEqual(document.execCommandCalls, ['copy']);
  assert.equal(document.getElementById('copyBtn').textContent, 'Copy Prompt');
  assert.equal(document.getElementById('toast').classList.contains('show'), false);
  assert.equal(document.body.children.length, 0, 'fallback textarea should be cleaned up');
});
