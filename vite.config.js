import { defineConfig } from 'vite';

// Porta 8080: a mesma que o Lovable usa no preview.
export default defineConfig({
  server: { host: '::', port: 8080 },
  build: { target: 'es2020' }
});
