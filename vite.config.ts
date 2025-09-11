import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        appwrite: resolve(__dirname, 'lib/appwrite.ts'),
        'node-appwrite': resolve(__dirname, 'lib/node-appwrite.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format}.js`,
    },
  },
  plugins: [dts({ bundleTypes: true })],
});
