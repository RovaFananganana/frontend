<template>
  <div 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700"
    :class="{ '-translate-x-full lg:translate-x-0': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
          </svg>
        </div>
        <h1 class="text-lg font-semibold text-gray-900 dark:text-white">DocManager</h1>
      </div>
      <button 
        @click="toggleSidebar"
        class="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <!-- Raccourcis principaux -->
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
    @click="toggleSidebar"
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

// Emits
const emit = defineEmits(['toggle'])

// Variables réactives
const route = useRoute()

const mainNavItems = ref([
  {
    name: 'Tableau de bord',
    to: '/',
    icon: 'HomeIcon',
    count: null
  },
  {
    name: 'Tous les fichiers',
    to: '/files',
    icon: 'DocumentIcon',
    count: 1247
  },
  {
    name: 'Documents',
    to: '/documents',
    icon: 'DocumentTextIcon',
    count: 89
  },
  {
    name: 'Images',
    to: '/images',
    icon: 'PhotographIcon',
    count: 156
  },
  {
    name: 'Vidéos',
    to: '/videos',
    icon: 'VideoCameraIcon',
    count: 23
  },
  {
    name: 'Archives',
    to: '/archives',
    icon: 'ArchiveIcon',
    count: 45
  },
  {
    name: 'Corbeille',
    to: '/trash',
    icon: 'TrashIcon',
    count: 12
  }
])

const favoritefolders = ref([
  { id: 1, name: 'Projets', path: '/folders/projects' },
  { id: 2, name: 'Photos famille', path: '/folders/family-photos' },
  { id: 3, name: 'Factures', path: '/folders/invoices' },
  { id: 4, name: 'Sauvegarde', path: '/folders/backup' }
])

// Stockage
const storageUsed = ref('2.1 TB')
const storageTotal = ref('4.0 TB')
const storagePercent = computed(() => {
  return Math.round((2.1 / 4.0) * 100)
})

// Méthodes
const toggleSidebar = () => {
  emit('toggle')
}

const isActiveRoute = (path) => {
  return route.path === path
}

// Composants d'icônes (à remplacer par vos icônes préférées)
const HomeIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
}

const DocumentIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
}

const DocumentTextIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
}

const PhotographIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
}

const VideoCameraIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
}

const ArchiveIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>`
}

const TrashIcon = {
  template: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`
}
</script>