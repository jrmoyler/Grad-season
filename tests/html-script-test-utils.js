const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function extractLastInlineScript(relativePath) {
  const file = fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');
  const matches = [...file.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  if (!matches.length) throw new Error(`No inline script found in ${relativePath}`);
  return matches[matches.length - 1][1];
}

class FakeClassList {
  constructor(element) {
    this.element = element;
    this.set = new Set((element.className || '').split(/\s+/).filter(Boolean));
  }
  add(...names) {
    names.forEach((name) => this.set.add(name));
    this._sync();
  }
  remove(...names) {
    names.forEach((name) => this.set.delete(name));
    this._sync();
  }
  contains(name) {
    return this.set.has(name);
  }
  toggle(name, force) {
    if (force === true) this.set.add(name);
    else if (force === false) this.set.delete(name);
    else if (this.set.has(name)) this.set.delete(name);
    else this.set.add(name);
    this._sync();
  }
  _sync() {
    this.element.className = [...this.set].join(' ');
  }
}

class FakeElement {
  constructor(id = '', options = {}) {
    this.id = id;
    this.value = options.value || '';
    this.textContent = options.textContent || '';
    this.innerHTML = options.innerHTML || '';
    this.style = { ...(options.style || {}) };
    this.dataset = { ...(options.dataset || {}) };
    this.className = options.className || '';
    this.classList = new FakeClassList(this);
    this.disabled = Boolean(options.disabled);
    this.onclick = options.onclick || null;
    this.ownerDocument = null;
  }

  scrollIntoView() {}
  focus() {}
  setAttribute(name, value) {
    this[name] = value;
  }
  select() {
    if (this.ownerDocument) this.ownerDocument.__selectedElement = this;
  }
  setSelectionRange() {}
  remove() {
    if (this.ownerDocument) this.ownerDocument.body.removeChild(this);
  }

  set outerHTML(html) {
    if (!this.ownerDocument) {
      this._outerHTML = html;
      return;
    }
    const idMatch = html.match(/id="([^"]+)"/);
    const classMatch = html.match(/class="([^"]+)"/);
    const textMatch = html.match(/>([^<]*)<\/button>/);
    const replacement = new FakeElement(idMatch ? idMatch[1] : this.id, {
      className: classMatch ? classMatch[1] : '',
      textContent: textMatch ? textMatch[1] : '',
    });
    this.ownerDocument.registerElement(replacement);
  }
}

class FakeBody {
  constructor(document) {
    this.document = document;
    this.children = [];
  }
  appendChild(element) {
    element.ownerDocument = this.document;
    this.children.push(element);
    return element;
  }
  removeChild(element) {
    this.children = this.children.filter((child) => child !== element);
    return element;
  }
}

class FakeDocument {
  constructor(initialElements = {}) {
    this.elements = new Map();
    this.listeners = {};
    this.body = new FakeBody(this);
    this.execCommandCalls = [];
    this.__selectedElement = null;
    Object.entries(initialElements).forEach(([id, options]) => {
      this.registerElement(new FakeElement(id, options));
    });
  }

  registerElement(element) {
    element.ownerDocument = this;
    this.elements.set(element.id, element);
    return element;
  }

  createElement(tag) {
    return new FakeElement('', { tagName: tag });
  }

  getElementById(id) {
    return this.elements.get(id) || null;
  }

  querySelectorAll(selector) {
    const groupMatch = selector.match(/^\.style-btn\[data-group="([^"]+)"\]$/);
    if (groupMatch) {
      const group = groupMatch[1];
      return [...this.elements.values()].filter((el) => el.classList.contains('style-btn') && el.dataset.group === group);
    }
    if (selector === '.faq-item.open') {
      return [...this.elements.values()].filter((el) => el.classList.contains('faq-item') && el.classList.contains('open'));
    }
    if (selector === 'a[href^="#"]') {
      return [];
    }
    return [];
  }

  querySelector(selector) {
    if (selector === '.proof-bar') return this.getElementById('proofBar');
    return null;
  }

  addEventListener(type, handler) {
    this.listeners[type] = handler;
  }

  dispatchEvent(type) {
    if (this.listeners[type]) this.listeners[type]();
  }

  execCommand(command) {
    this.execCommandCalls.push(command);
    return true;
  }
}

function createBaseContext(document, overrides = {}) {
  const context = {
    console,
    document,
    window: { scrollTo() {} },
    navigator: {},
    alert: (message) => {
      context.__alerts.push(message);
    },
    __alerts: [],
    fetch: async () => ({ ok: true }),
    setTimeout: (fn) => {
      fn();
      return 1;
    },
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    Date,
    Math,
    Promise,
    ...overrides,
  };
  context.globalThis = context;
  return context;
}

function loadScript(relativePath, context, exportNames) {
  const script = extractLastInlineScript(relativePath);
  const exportBlock = `\n;globalThis.__exports = { ${exportNames.join(', ')} };`;
  vm.runInNewContext(script + exportBlock, context, { filename: relativePath });
  return context.__exports;
}

module.exports = {
  FakeDocument,
  FakeElement,
  createBaseContext,
  loadScript,
};
