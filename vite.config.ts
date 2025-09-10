import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'appwrite-typed-db',
      fileName: format => `appwrite-typed-db.${format}.js`,
    },
  },
  plugins: [dts({ bundleTypes: true })],
});
