import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// Polyfill `globalThis.crypto.getRandomValues` for older Node versions (e.g. Node 16)
// Vite (and some deps) may call `getRandomValues` on the Node crypto import.
// If Node's global crypto is missing, map `node:crypto`'s `webcrypto`.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeCrypto = require('node:crypto');
  if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
    if (nodeCrypto?.webcrypto) {
      // @ts-expect-error - assigning webcrypto to globalThis for runtime use
      globalThis.crypto = nodeCrypto.webcrypto;
    }
  }
} catch (e) {
  // ignore - environments without node:crypto will fail here, but browser runtime is unaffected
}
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173, 
    allowedHosts: [
      "5f2d-84-54-80-48.ngrok-free.app"
    ]
  },
})
