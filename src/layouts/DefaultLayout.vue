<template>
  <!-- Layout principal de l'application avec sidebar et header -->
  <div class="flex h-screen bg-secondary-50 overflow-hidden">
    
    <!-- Sidebar mobile overlay -->
    <div 
      v-show="isMobileSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      @click="closeMobileSidebar"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed md:relative inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out transform',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <Sidebar 
        :is-mobile-open="isMobileSidebarOpen"
        @close-mobile="closeMobileSidebar"
      />
    </div>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      
      <!-- Header/Navbar -->
      <header class="bg-white border-b border-secondary-200 px-4 py-4 md:px-6">
        <Navbar 
          @toggle-sidebar="toggleMobileSidebar"
          @open-search="openSearchModal"
        />
      </header>

      <!-- Zone de contenu principal avec scroll -->
      <main class="flex-1 overflow-auto bg-secondary-50 focus:outline-none">
        <div class="container mx-auto px-4 py-6 md:px-6 lg:px-8">
          
          <!-- Fil d'ariane si présent -->
          <Breadcrumbs 
            v-if="showBreadcrumbs && breadcrumbs.length > 1"
            :items="breadcrumbs"
            class="mb-6"
            @navigate="handleBreadcrumbNavigation"
          />
          
          <!-- Slot pour le contenu de la page -->
          <div class="animate-fade-in">
            <slot />
          </div>
          
        </div>
      </main>

    </div>

    <!-- Modal de recherche rapide -->
    <SearchModal 
      v-model="showSearchModal"
      @search="handleSearch"
    />

    <!-- Modal de raccourcis clavier -->
    <KeyboardShortcutsModal 
      v-model="showShortcutsModal"
    />

    <!-- Notification de mise à jour disponible -->
    <UpdateNotification 
      v-if="showUpdateNotification"
      @dismiss="dismissUpdateNotification"
      @update="handleAppUpdate"
    />

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useDocumentsStore } from '@/store/documents'

// Import des composants
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
import SearchModal from '@/components/SearchModal.vue'
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal.vue'
import UpdateNotification from '@/components/UpdateNotification.vue'

export default {
  name: 'DefaultLayout',
  components: {
    Sidebar,
    Navbar,
    Breadcrumbs,
    SearchModal,
    KeyboardShortcutsModal,
    UpdateNotification
  },

  setup() {
    // Composables
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const documentsStore = useDocumentsStore()

    // État du layout
    const isMobileSidebarOpen = ref(false)
    const showSearchModal = ref(false)
    const showShortcutsModal = ref(false)
    const showUpdateNotification = ref(false)
    const isOnline = ref(navigator.onLine)

    // Computed properties
    const showBreadcrumbs = computed(() => {
      // Afficher le fil d'ariane pour certaines pages
      const pagesWithBreadcrumbs = ['Files', 'Search']
      return pagesWithBreadcrumbs.includes(route.name)
    })

    const breadcrumbs = computed(() => {
      if (route.name === 'Files') {
        return documentsStore.breadcrumbs
      } else if (route.name === 'Search') {
        return [
          { id: 0, name: 'Accueil', path: '/' },
          { id: -1, name: 'Recherche', path: '/search' }
        ]
      }
      return []
    })

    // Méthodes de gestion de la sidebar mobile
    const toggleMobileSidebar = () => {
      isMobileSidebarOpen.value = !isMobileSidebarOpen.value
    }

    const closeMobileSidebar = () => {
      isMobileSidebarOpen.value = false
    }

    // Méthodes de gestion des modales
    const openSearchModal = () => {
      showSearchModal.value = true
    }

    const openShortcutsModal = () => {
      showShortcutsModal.value = true
    }

    const dismissUpdateNotification = () => {
      showUpdateNotification.value = false
      localStorage.setItem('dismissed-update', Date.now().toString())
    }

    // Méthodes de navigation
    const handleBreadcrumbNavigation = async (item) => {
      if (item.id === 0) {
        // Navigation vers la racine
        await router.push('/files')
      } else if (item.id > 0) {
        // Navigation vers un dossier spécifique
        await router.push(`/files/${item.id}`)
      }
    }

    const handleSearch = async (searchData) => {
      await router.push({
        name: 'Search',
        query: {
          q: searchData.query,
          type: searchData.type || ''
        }
      })
      showSearchModal.value = false
    }

    const handleAppUpdate = () => {
      // Rechargement de l'application pour la mise à jour
      window.location.reload()
    }

    // Gestion des raccourcis clavier globaux
    const handleKeyboardShortcuts = (event) => {
      // Ignorer si un champ de saisie est actif
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
        return
      }

      // Cmd/Ctrl + K : Recherche
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        openSearchModal()
      }

      // ? : Aide/Raccourcis
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        openShortcutsModal()
      }

      // Échap : Fermer les modales/sélections
      if (event.key === 'Escape') {
        if (showSearchModal.value) {
          showSearchModal.value = false
        } else if (showShortcutsModal.value) {
          showShortcutsModal.value = false
        } else if (documentsStore.hasSelection) {
          documentsStore.clearSelection()
        } else if (isMobileSidebarOpen.value) {
          closeMobileSidebar()
        }
      }

      // f : Focus sur les fichiers (si sur la page Files)
      if (event.key === 'f' && route.name === 'Files') {
        event.preventDefault()
        const firstFile = document.querySelector('[data-file-item]')
        if (firstFile) firstFile.focus()
      }

      // u : Upload (si sur la page Files)
      if (event.key === 'u' && route.name === 'Files') {
        event.preventDefault()
        document.dispatchEvent(new CustomEvent('trigger-upload'))
      }

      // n : Nouveau dossier (si sur la page Files)
      if (event.key === 'n' && route.name === 'Files') {
        event.preventDefault()
        document.dispatchEvent(new CustomEvent('create-folder'))
      }
    }

    // Gestion des changements de connectivité
    const handleOnline = () => {
      isOnline.value = true
    }

    const handleOffline = () => {
      isOnline.value = false
    }

    // Gestion du redimensionnement de la fenêtre
    const handleResize = () => {
      // Fermer la sidebar mobile sur grand écran
      if (window.innerWidth >= 768 && isMobileSidebarOpen.value) {
        closeMobileSidebar()
      }
    }

    // Détection des mises à jour d'application (PWA)
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          const lastDismissed = localStorage.getItem('dismissed-update')
          const daysSinceLastDismissal = lastDismissed 
            ? (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24)
            : 999

          // Afficher la notification si pas dismissée récemment
          if (daysSinceLastDismissal > 1) {
            showUpdateNotification.value = true
          }
        })
      }
    }

    // Event listener personnalisé pour ouvrir la recherche
    const handleOpenSearchEvent = () => {
      openSearchModal()
    }

    // Watchers
    watch(
      () => route.name,
      () => {
        // Fermer la sidebar mobile lors des changements de route
        closeMobileSidebar()
      }
    )

    // Lifecycle hooks
    onMounted(() => {
      // Event listeners
      document.addEventListener('keydown', handleKeyboardShortcuts)
      document.addEventListener('open-search', handleOpenSearchEvent)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      window.addEventListener('resize', handleResize)

      // Vérification des mises à jour
      checkForUpdates()
    })

    onUnmounted(() => {
      // Nettoyage des event listeners
      document.removeEventListener('keydown', handleKeyboardShortcuts)
      document.removeEventListener('open-search', handleOpenSearchEvent)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('resize', handleResize)
    })

    return {
      // État
      isMobileSidebarOpen,
      showSearchModal,
      showShortcutsModal,
      showUpdateNotification,
      isOnline,

      // Computed
      showBreadcrumbs,
      breadcrumbs,

      // Méthodes
      toggleMobileSidebar,
      closeMobileSidebar,
      openSearchModal,
      openShortcutsModal,
      dismissUpdateNotification,
      handleBreadcrumbNavigation,
      handleSearch,
      handleAppUpdate
    }
  }
}
</script>

<style scoped>
/* Animations pour l'entrée du contenu */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out;
}

/* Transitions pour la sidebar mobile */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

/* Styles pour le mode offline */
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #f59e0b;
  color: white;
  text-align: center;
  padding: 0.5rem;
  z-index: 50;
  font-size: 0.875rem;
}

/* Scrollbar personnalisée pour le contenu principal */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: #f1f5f9;
}

main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Amélioration de l'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none;
  }
  
  .sidebar-enter-active,
  .sidebar-leave-active {
    transition: none;
  }
}

/* Styles pour l'impression */
@media print {
  .sidebar,
  .navbar,
  .breadcrumbs {
    display: none;
  }
  
  main {
    margin: 0;
    padding: 1rem;
  }
}</style>