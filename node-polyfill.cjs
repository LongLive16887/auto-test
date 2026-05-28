// Ensure `globalThis.crypto.getRandomValues` exists in older Node versions
try {
  const nodeCrypto = require('node:crypto');
  if (nodeCrypto?.webcrypto) {
    if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
      globalThis.crypto = nodeCrypto.webcrypto;
    }
    if (typeof nodeCrypto.getRandomValues !== 'function' && typeof nodeCrypto.webcrypto.getRandomValues === 'function') {
      nodeCrypto.getRandomValues = nodeCrypto.webcrypto.getRandomValues.bind(nodeCrypto.webcrypto);
    }
  }
} catch (e) {
  // no-op
}

// Polyfill `structuredClone` on Node versions that lack it (e.g., Node 16)
try {
  const v8 = require('v8');
  if (typeof globalThis.structuredClone !== 'function') {
    globalThis.structuredClone = function structuredClone(obj) {
      return v8.deserialize(v8.serialize(obj));
    };
  }
} catch (e) {
  // no-op - if v8 isn't available, fall back to JSON clone for plain objects
  if (typeof globalThis.structuredClone !== 'function') {
    globalThis.structuredClone = function structuredClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    };
  }
}
