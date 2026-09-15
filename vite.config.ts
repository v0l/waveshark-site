import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: '#app',
        additionalPrerenderRoutes: ['/download'],
        previewMiddlewareEnabled: true,
      },
    }),
  ],
  build: { target: 'es2022' },
});
