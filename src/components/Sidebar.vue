<template>
  <div 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out"
    :class="{ '-translate-x-full lg:translate-x-0': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <!-- <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
          </svg>
        </div> -->
        <h1 class="text-lg font-semibold text-blue-900 dark:text-white"> Gestion des Documents </h1>
      </div>

      <!-- Bouton mobile pour fermer -->
      <button 
        @click="closeSidebarMobile"
        class="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation principale -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <div class="mb-6">
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Navigation
        </h3>
        <ul class="space-y-1">
          <li v-for="item in mainNavItems" :key="item.name">
            <router-link
              :to="item.to"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="isActiveRoute(item.to) 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
              {{ item.name }}
              <span v-if="item.count" class="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                {{ item.count }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Stockage -->
      <div class="mb-6">
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Stockage
        </h3>
        <div class="px-3 py-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Utilisé</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ storageUsed }} / {{ storageTotal }}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: storagePercent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Dossiers favoris -->
      <div>
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Dossiers favoris
        </h3>
        <ul class="space-y-1">
          <li v-for="folder in favoritefolders" :key="folder.id">
            <router-link
              :to="folder.path"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg class="w-4 h-4 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              {{ folder.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">Admin</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">RS819 NAS</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay pour mobile -->
  <div 
    v-if="isOpen" 
    @click="closeSidebarMobile"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
  ></div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Événements
const emit = defineEmits(['toggle', 'closeMobile'])

// Router
const route = useRoute()

// Navigation principale
const mainNavItems = ref([
  { name: 'Tableau de bord', to: '/', icon: 'HomeIcon', count: null },
  { name: 'Tous les fichiers', to: '/files', icon: 'DocumentIcon', count: 1247 },
  { name: 'Documents', to: '/documents', icon: 'DocumentTextIcon', count: 89 },
  { name: 'Images', to: '/images', icon: 'PhotographIcon', count: 156 },
  { name: 'Vidéos', to: '/videos', icon: 'VideoCameraIcon', count: 23 },
  { name: 'Archives', to: '/archives', icon: 'ArchiveIcon', count: 45 },
  { name: 'Corbeille', to: '/trash', icon: 'TrashIcon', count: 12 }
])

// Dossiers favoris
const favoritefolders = ref([
  { id: 1, name: 'Projets', path: '/folders/projects' },
  { id: 2, name: 'Photos famille', path: '/folders/family-photos' },
  { id: 3, name: 'Factures', path: '/folders/invoices' },
  { id: 4, name: 'Sauvegarde', path: '/folders/backup' }
])

// Stockage
const storageUsed = ref('2.1 TB')
const storageTotal = ref('4.0 TB')
const storagePercent = computed(() => Math.round((2.1 / 4.0) * 100))

// Méthodes
const toggleSidebar = () => emit('toggle')

const closeSidebarMobile = () => emit('closeMobile')

const isActiveRoute = (path) => route.path === path

// Composants d'icônes (à ajouter si nécessaire, comme dans ton code actuel)
</script>
