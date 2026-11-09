const test = require('node:test');
const assert = require('node:assert/strict');
const { FakeDocument, FakeElement, createBaseContext, loadScript } = require('./html-script-test-utils');

function createOrderHarness() {
  const document = new FakeDocument({
    progressBar: {},
    backBtn: { style: {} },
    nextBtn: { className: 'btn-next', style: {}, disabled: true },
    reviewTable: {},
    totalDisplay: {},
    formWrap: { style: {} },
    successWrap: { style: { display: 'none' } },
    successTitle: {},
    successSub: {},
    confirmEmail: {},
    successBadges: {},
    'pt-figurine': { className: '' },
    'sw-figurine': { style: {} },
    'thumb-figurine': { style: {} },
    'pb-figurine': { style: {} },
    'pt-comic': { className: '' },
    'sw-comic': { style: {} },
    'thumb-comic': { style: {} },
    'pb-comic': { style: {} },
    'pt-storybook': { className: '' },
    'sw-storybook': { style: {} },
    'thumb-storybook': { style: {} },
    'pb-storybook': { style: {} },
    'career-block': { style: {} },
    'photo-block': { style: {} },
    'step-0': { className: '' },
    'step-1': { className: 'step-hidden' },
    'step-2': { className: 'step-hidden' },
    'step-3': { className: 'step-hidden' },
    parentName: { value: 'Jane Smith' },
    email: { value: 'jane@example.com' },
    phone: { value: '555-0100' },
    gradName: { value: 'Marcus Smith' },
    grade: { value: '5th' },
    school: { value: 'Columbus East' },
    careerChoice: { value: '' },
    outfitPhotoUrl: { value: '' },
    favMemory: { value: 'The science fair.' },
    challenge: { value: 'Learning to read.' },
    proudMoment: { value: 'Winning student of the month.' },
    futureGoal: { value: 'Become an engineer.' },
    personality: { value: 'Brave, Funny, Determined' },
    funFact: { value: 'Knows every dinosaur.' },
    dedication: { value: 'We love you.' },
  });

  ['claymation', 'funko', 'realistic'].forEach((value, index) => {
    document.registerElement(new FakeElement(`fstyle-${index}`, { className: 'style-btn', dataset: { group: 'fstyle', val: value } }));
  });
  ['grad', 'photo', 'career'].forEach((value, index) => {
    document.registerElement(new FakeElement(`ffit-${index}`, { className: 'style-btn', dataset: { group: 'ffit', val: value } }));
  });
  ['manga', 'superhero', 'cartoon'].forEach((value, index) => {
    document.registerElement(new FakeElement(`comic-${index}`, { className: 'style-btn', dataset: { group: 'comic', val: value } }));
  });
  ['watercolor', 'graphic', 'classic'].forEach((value, index) => {
    document.registerElement(new FakeElement(`story-${index}`, { className: 'style-btn', dataset: { group: 'story', val: value } }));
  });

  const fetchCalls = [];
  const context = createBaseContext(document, {
    fetch: async (url, options) => {
      fetchCalls.push({ url, options });
      return { ok: true };
    },
  });

  const exports = loadScript('public/order.html', context, [
    'state', 'toggleProduct', 'pickStyle', 'canAdvance', 'calcTotal', 'buildReview', 'submitOrder'
  ]);

  return { document, context, fetchCalls, ...exports };
}

test('order validation requires a photo/outfit description when photo fit is selected', () => {
  const { state, toggleProduct, canAdvance, pickStyle, document } = createOrderHarness();
  state.step = 1;
  toggleProduct('figurine');

  const figurineStyle = document.getElementById('fstyle-0');
  const photoFit = document.getElementById('ffit-1');
  pickStyle(figurineStyle);
  pickStyle(photoFit);

  assert.equal(canAdvance(), false, 'photo fit should block progress until a description or link is provided');

  document.getElementById('outfitPhotoUrl').value = 'https://example.com/outfit-photo';
  assert.equal(canAdvance(), true);
});

test('order submission posts the payload and reveals the success state', async () => {
  const { state, toggleProduct, pickStyle, document, submitOrder, fetchCalls } = createOrderHarness();
  state.step = 1;
  toggleProduct('figurine');
  toggleProduct('comic');
  pickStyle(document.getElementById('fstyle-0'));
  pickStyle(document.getElementById('ffit-0'));
  pickStyle(document.getElementById('comic-1'));

  await submitOrder();

  // Two calls since the Stripe step landed: the Apps Script row write, then checkout.
  const sheetCalls = fetchCalls.filter((c) => /script\.google\.com/.test(c.url));
  assert.equal(sheetCalls.length, 1);
  assert.equal(fetchCalls.length, 2);
  assert.equal(fetchCalls[1].url, '/api/create-checkout-session');
  const payload = JSON.parse(sheetCalls[0].options.body);
  assert.equal(payload.orderTotal, 123);
  assert.equal(payload.wantsFigurine, true);
  assert.equal(payload.comicStyle, 'superhero');
  assert.equal(document.getElementById('formWrap').style.display, 'none');
  assert.equal(document.getElementById('successWrap').style.display, 'block');
  assert.match(document.getElementById('successTitle').textContent, /Marcus Smith/);
  assert.match(document.getElementById('successBadges').innerHTML, /Figurine/);
  assert.match(document.getElementById('successBadges').innerHTML, /Comic/);
});

test('order payload keeps every field name the Apps Script reads', async () => {
  const { state, toggleProduct, pickStyle, document, submitOrder, fetchCalls } = createOrderHarness();
  state.step = 1;
  toggleProduct('storybook');
  pickStyle(document.getElementById('story-0'));
  await submitOrder();
  const payload = JSON.parse(fetchCalls[0].options.body);
  const expected = ['parentName','email','phone','gradName','grade','school','wantsFigurine','figurineStyle',
    'figurineFit','careerChoice','photoUrl','wantsComic','comicStyle','comicPhotoUrl','wantsStorybook',
    'storybookStyle','storybookPhotoUrl','favMemory','challenge','proudMoment','futureGoal','personality',
    'funFact','dedication','orderTotal','submittedAt'];
  assert.deepEqual(Object.keys(payload), expected);
  assert.equal(payload.orderTotal, 44);
});

test('prices match PRICING_LOCK.md', () => {
  const { state, toggleProduct, calcTotal } = createOrderHarness();
  state.step = 1;
  toggleProduct('figurine'); assert.equal(calcTotal(), 89);
  toggleProduct('comic'); assert.equal(calcTotal(), 123);
  toggleProduct('storybook'); assert.equal(calcTotal(), 167);
});

test('Cloudinary infrastructure IDs are unchanged', () => {
  const html = require('node:fs').readFileSync('public/order.html', 'utf8');
  assert.match(html, /CLOUDINARY_CLOUD_NAME\s*=\s*'domb47apg'/);
  assert.match(html, /CLOUDINARY_UPLOAD_PRESET\s*=\s*'grad_season_uploads'/);
  ['grad-season/figurines', 'grad-season/comics', 'grad-season/storybooks'].forEach((f) => assert.ok(html.includes(`'${f}'`), f));
});
