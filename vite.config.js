import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/workspace-rolodex/', // Set the base URL for GitHub Pages
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'), // Ensure the entry point is correctly set
      output: {
        manualChunks: {
          'three': ['three'], // Split Three.js into its own chunk
          // 'gh-pages': ['gh-pages'], // Split gh-pages into its own chunk
          // Add other large libraries here
        }
      },
      external: ['fsevents'], // Exclude fsevents from the build process
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias for src directory
      'three': resolve(__dirname, 'node_modules/three') // Ensure a single instance of Three.js
    },
  },
});