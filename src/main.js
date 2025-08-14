import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'

// Import des composants et configurations
import App from './App.vue'
import router from './router'

// Import des styles
import './style.css' // Fichier de styles global
import 'vue-toastification/dist/index.css'

// Configuration des notifications toast
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  maxToasts: 5,
  newestOnTop: true
}

// Création de l'instance Vue
const app = createApp(App)

// Configuration des plugins
app.use(createPinia()) // Store de gestion d'état
app.use(router) // Routeur Vue
app.use(Toast, toastOptions) // Notifications toast

// Montage de l'application sur l'élément #app
app.mount('#app')

// Gestion globale des erreurs non capturées
app.config.errorHandler = (error, vm, info) => {
  console.error('Erreur globale capturée:', error, info)
  
  // En production, on pourrait envoyer les erreurs à un service de monitoring
  if (import.meta.env.PROD) {
    // Exemple: Sentry.captureException(error)
  }
}

// Configuration globale pour le développement
if (import.meta.env.DEV) {
  app.config.devtools = true
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = window.__VUE_DEVTOOLS_GLOBAL_HOOK__ || {}
}
