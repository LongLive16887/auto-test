// Ensure `globalThis.crypto.getRandomValues` exists in older Node versions
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('node:crypto');
  if (nodeCrypto?.webcrypto && (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function')) {
    globalThis.crypto = nodeCrypto.webcrypto;
  }
} catch (e) {
  // no-op
}
