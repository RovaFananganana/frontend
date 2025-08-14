
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Configuration Vite pour le projet Vue.js
export default defineConfig({
  plugins: [vue()], // Plugin Vue pour Vite
  
  // Configuration des alias pour les imports
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // Configuration du serveur de développement
  server: {
    port: 5173,
    proxy: {
      // Proxy pour les appels API vers le backend Python
      '/api': {
        target: 'http://localhost:5001', // URL de votre backend Python
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Configuration pour la construction en production
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
