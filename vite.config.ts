import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';

const removeCrossoriginPlugin = () => {
  return {
    name: 'remove-crossorigin',
    enforce: 'post' as const,
    transformIndexHtml(html: string) {
      return html.replace(/\s+crossorigin(="[^"]*")?/g, '');
    }
  };
};

export default defineConfig({
  root: './src',
  publicDir: '../public',
  base: './', // CRITICAL for Android WebView (file:// protocol)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11', 'Android >= 6']
    }),
    removeCrossoriginPlugin()
  ],
  build: {
    outDir: '../android-app/app/src/main/assets/www',
    emptyOutDir: true, // also necessary
    rollupOptions: {
      input: './index.html',
    }
  }
});
