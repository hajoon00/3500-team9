import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest-and-assets',
      buildEnd() {
        // Ensure dist directory exists
        if (!existsSync('dist')) {
          mkdirSync('dist', { recursive: true });
        }
        
        // Copy manifest.json
        copyFileSync('public/manifest.json', 'dist/manifest.json');
        
        // Copy background.js
        copyFileSync('public/background.js', 'dist/background.js');
        
        // Copy content.js
        copyFileSync('public/content.js', 'dist/content.js');
        
        // Copy sidebar.html
        copyFileSync('public/sidebar.html', 'dist/sidebar.html');
        
        // Copy images folder
        if (!existsSync('dist/images')) {
          mkdirSync('dist/images', { recursive: true });
        }
        // Copy each image individually
        const images = ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'logo.png'];
        images.forEach(image => {
          if (existsSync(`public/images/${image}`)) {
            copyFileSync(`public/images/${image}`, `dist/images/${image}`);
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sidebar: resolve(__dirname, 'src/sidebar.tsx'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name].[ext]';
        }
      }
    },
  },
}); 