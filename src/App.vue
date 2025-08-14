<template>
  <!-- Conteneur principal de l'application -->
  <div id="app" class="min-h-screen bg-secondary-50 antialiased">
    <!-- Chargement initial de l'application -->
    <div v-if="isInitializing" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="spinner w-8 h-8 mx-auto mb-4"></div>
        <p class="text-secondary-600">Chargement...</p>
      </div>
    </div>

    <!-- Contenu principal avec layout dynamique -->
    <div v-else class="min-h-screen">
      <!-- Rendu dynamique du layout selon la route -->
      <component 
        :is="currentLayout" 
        v-if="currentLayout"
        :key="$route.path"
      >
        <!-- Vue principale avec transitions -->
        <router-view v-slot="{ Component, route }">
          <transition 
            :name="transitionName" 
            mode="out-in"
            :duration="300"
          >
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </component>
      
      <!-- Fallback si aucun layout n'est défini -->
      <router-view v-else />
    </div>

    <!-- Overlay de chargement global pour les opérations -->
    <div 
      v-if="showGlobalLoading" 
      class="fixed inset-0 bg-black bg-opacity-25 z-40 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="flex items-center space-x-4">
          <div class="spinner w-6 h-6"></div>
          <span class="text-secondary-700">{{ globalLoadingMessage }}</span>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation pour les actions destructives -->
    <ConfirmationModal 
      v-model="showConfirmModal"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirm-text="confirmModal.confirmText"
      :cancel-text="confirmModal.cancelText"
      :is-destructive="confirmModal.isDestructive"
      @confirm="handleConfirmation"
    />

    <!-- Modal de notification pour les messages système -->
    <NotificationModal 
      v-model="showNotificationModal"
      :type="notificationModal.type"
      :title="notificationModal.title"
      :message="notificationModal.message"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useDocumentsStore } from '@/store/documents'

// Import des layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Import des composants modaux
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import NotificationModal from '@/components/NotificationModal.vue'

export default {
  name: 'App',
  components: {
    DefaultLayout,
    AuthLayout,
    ConfirmationModal,
    NotificationModal
  },
  
  setup() {
    // Stores
    const authStore = useAuthStore()
    const documentsStore = useDocumentsStore()
    const route = useRoute()

    // État de l'application
    const isInitializing = ref(true)
    const showGlobalLoading = ref(false)
    const globalLoadingMessage = ref('')

    // État des modales
    const showConfirmModal = ref(false)
    const confirmModal = ref({
      title: '',
      message: '',
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      isDestructive: false,
      onConfirm: null
    })

    const showNotificationModal = ref(false)
    const notificationModal = ref({
      type: 'info', // 'info', 'success', 'warning', 'error'
      title: '',
      message: ''
    })

    // Calculs
    const currentLayout = computed(() => {
      const layoutName = route.meta?.layout || 'DefaultLayout'
      
      // Map des layouts disponibles
      const layouts = {
        'DefaultLayout': DefaultLayout,
        'AuthLayout': AuthLayout
      }
      
      return layouts[layoutName] || DefaultLayout
    })

    const transitionName = computed(() => {
      // Différentes transitions selon le contexte
      if (route.meta?.transition) {
        return route.meta.transition
      }
      
      // Transition par défaut
      return 'fade'
    })

    // Méthodes globales

    /**
     * Affichage du loading global
     * @param {string} message - Message à afficher
     */
    const showLoading = (message = 'Chargement...') => {
      globalLoadingMessage.value = message
      showGlobalLoading.value = true
    }

    /**
     * Masquage du loading global
     */
    const hideLoading = () => {
      showGlobalLoading.value = false
      globalLoadingMessage.value = ''
    }

    /**
     * Affichage d'une modal de confirmation
     * @param {Object} options - Options de la modal
     */
    const showConfirmation = (options) => {
      return new Promise((resolve) => {
        confirmModal.value = {
          title: options.title || 'Confirmation',
          message: options.message || 'Êtes-vous sûr ?',
          confirmText: options.confirmText || 'Confirmer',
          cancelText: options.cancelText || 'Annuler',
          isDestructive: options.isDestructive || false,
          onConfirm: resolve
        }
        showConfirmModal.value = true
      })
    }

    /**
     * Gestion de la confirmation
     * @param {boolean} confirmed - Résultat de la confirmation
     */
    const handleConfirmation = (confirmed) => {
      if (confirmModal.value.onConfirm) {
        confirmModal.value.onConfirm(confirmed)
      }
      showConfirmModal.value = false
    }

    /**
     * Affichage d'une notification
     * @param {Object} options - Options de la notification
     */
    const showNotification = (options) => {
      notificationModal.value = {
        type: options.type || 'info',
        title: options.title || 'Information',
        message: options.message || ''
      }
      showNotificationModal.value = true
      
      // Auto-fermeture après 5 secondes pour les notifications non critiques
      if (options.type !== 'error') {
        setTimeout(() => {
          showNotificationModal.value = false
        }, 5000)
      }
    }

    /**
     * Initialisation de l'application
     */
    const initializeApp = async () => {
      try {
        // Initialisation des préférences utilisateur
        documentsStore.initializePreferences()
        
        // Tentative de restauration de la session
        if (authStore.token) {
          await authStore.initializeAuth()
        }
        
        // Chargement initial des statistiques système si connecté
        if (authStore.isAuthenticated) {
          await documentsStore.loadSystemStats()
        }
        
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error)
        // L'erreur sera gérée par les interceptors axios
      } finally {
        isInitializing.value = false
        
        // Masquage du loader initial HTML
        const initialLoader = document.querySelector('.initial-loader')
        if (initialLoader) {
          initialLoader.style.opacity = '0'
          setTimeout(() => {
            initialLoader.remove()
          }, 300)
        }
      }
    }

    /**
     * Gestion des raccourcis clavier globaux
     * @param {KeyboardEvent} event - Événement clavier
     */
    const handleGlobalKeyboard = (event) => {
      // Ctrl/Cmd + K : Recherche rapide
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        // Émettre un événement pour ouvrir la recherche
        document.dispatchEvent(new CustomEvent('open-search'))
      }
      
      // Échap : Fermer les modales
      if (event.key === 'Escape') {
        if (showConfirmModal.value) {
          handleConfirmation(false)
        }
        if (showNotificationModal.value) {
          showNotificationModal.value = false
        }
      }
    }

    /**
     * Gestion des erreurs globales JavaScript
     */
    const handleGlobalError = (event) => {
      console.error('Erreur JavaScript globale:', event.error)
      
      // En production, envoyer à un service de monitoring
      if (import.meta.env.PROD) {
        // Exemple: Sentry.captureException(event.error)
      }
      
      // Affichage d'une notification d'erreur générique
      showNotification({
        type: 'error',
        title: 'Erreur inattendue',
        message: 'Une erreur s\'est produite. Veuillez recharger la page si le problème persiste.'
      })
    }

    /**
     * Gestion des erreurs de promesses non capturées
     */
    const handleUnhandledRejection = (event) => {
      console.error('Promesse rejetée non capturée:', event.reason)
      
      // Empêcher l'affichage de l'erreur dans la console par défaut
      event.preventDefault()
      
      // En production, envoyer à un service de monitoring
      if (import.meta.env.PROD) {
        // Exemple: Sentry.captureException(event.reason)
      }
    }

    // Watchers

    /**
     * Surveillance des changements d'état d'authentification
     */
    watch(
      () => authStore.isAuthenticated,
      async (isAuthenticated) => {
        if (isAuthenticated) {
          // Chargement des données utilisateur
          await documentsStore.loadSystemStats()
        } else {
          // Nettoyage des données sensibles
          documentsStore.clearSelection()
        }
      }
    )

    /**
     * Surveillance des changements de route pour analytics
     */
    watch(
      () => route.path,
      (newPath, oldPath) => {
        // Ici on pourrait ajouter du tracking analytics
        if (import.meta.env.DEV) {
          console.log(`📊 Route change: ${oldPath} → ${newPath}`)
        }
      }
    )

    // Lifecycle hooks

    onMounted(() => {
      // Initialisation de l'application
      initializeApp()
      
      // Ajout des event listeners globaux
      document.addEventListener('keydown', handleGlobalKeyboard)
      window.addEventListener('error', handleGlobalError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
      
      // Gestion de la connectivité réseau
      window.addEventListener('online', () => {
        showNotification({
          type: 'success',
          title: 'Connexion rétablie',
          message: 'Vous êtes de nouveau en ligne'
        })
      })
      
      window.addEventListener('offline', () => {
        showNotification({
          type: 'warning',
          title: 'Connexion perdue',
          message: 'Vous êtes actuellement hors ligne'
        })
      })
    })

    // Nettoyage lors de la destruction du composant
    const cleanup = () => {
      document.removeEventListener('keydown', handleGlobalKeyboard)
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }

    // Fournir les méthodes globales aux composants enfants
    provide('showLoading', showLoading)
    provide('hideLoading', hideLoading)
    provide('showConfirmation', showConfirmation)
    provide('showNotification', showNotification)

    // Export des propriétés et méthodes
    return {
      // État
      isInitializing,
      showGlobalLoading,
      globalLoadingMessage,
      showConfirmModal,
      confirmModal,
      showNotificationModal,
      notificationModal,
      
      // Computed
      currentLayout,
      transitionName,
      
      // Méthodes
      handleConfirmation,
      cleanup
    }
  }
}
</script>

<style scoped>
/* Transitions pour les changements de route */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

/* Animations pour le chargement */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Styles pour les modales */
.modal-overlay {
  backdrop-filter: blur(4px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}
</style>