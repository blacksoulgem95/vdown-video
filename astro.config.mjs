import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@/lib': resolve(__dirname, 'src/lib'),
        '@/components': resolve(__dirname, 'src/components'),
        '@/layouts': resolve(__dirname, 'src/layouts'),
        '@/styles': resolve(__dirname, 'src/styles'),
      },
    },
  },
  server: {
    port: parseInt(process.env.PORT ?? '4321'),
    host: true,
  },
});
