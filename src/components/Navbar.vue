<template>
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-2.5">
    <div class="flex flex-wrap justify-between items-center">
      <!-- Left section -->
      <div class="flex justify-start items-center">
        <!-- Mobile menu button -->
        <button 
          @click="toggleSidebar"
          class="p-2 mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Search button (mobile) -->
        <button 
          @click="openSearch"
          class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- Search bar (desktop) -->
        <div class="hidden md:block relative mx-4">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            @keydown.enter="performSearch"
            @keydown="handleSearchKeydown"
            placeholder="Rechercher des fichiers"
            class="w-[500px] pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">

          </div>
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center lg:order-2 space-x-2">
        <!-- View toggle -->
        <div class="hidden sm:flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            @click="setViewMode('grid')"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''"
            class="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
            title="Vue grille"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="setViewMode('list')"
            :class="viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''"
            class="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
            title="Vue liste"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>

        <!-- Upload button -->
        <button 
          @click="openUploadModal"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span class="hidden sm:inline">Upload</span>
        </button>

        <!-- Notifications -->
        <button 
          @click="toggleNotifications"
          class="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5h5l-5-5M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ notificationCount }}
          </span>
        </button>

        <!-- Theme toggle -->
        <button 
          @click="toggleTheme"
          class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
          title="Changer le thème"
        >
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- User menu -->
        <div class="relative" ref="userMenuRef">
          <button 
            @click="toggleUserMenu"
            class="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <img 
              class="w-9 h-9 rounded-full" 
              src="/profil-2.png" 
              alt="Photo utilisateur"
            >
          </button>
          
          <!-- User dropdown menu -->
          <div 
            v-show="showUserMenu"
            class="absolute right-0 z-50 mt-2 w-56 text-base list-none bg-white divide-y divide-gray-100 shadow-lg dark:bg-gray-700 dark:divide-gray-600 rounded-xl"
            @click.stop
          >
            <div class="py-3 px-4">
              <span class="block text-sm font-semibold text-gray-900 dark:text-white">Admin User</span>
              <span class="block text-sm text-gray-500 dark:text-gray-400 truncate">admin@nas.local</span>
            </div>
            <ul class="py-1">
              <li>
                <a href="#" class="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                  <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </a>
              </li>
              <li>
                <a href="#" class="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                  <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </a>
              </li>
            </ul>
            <ul class="py-1">
              <li>
                <a href="#" @click="logout" class="flex items-center py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                  <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v-3" />
                  </svg>
                  Se déconnecter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile search overlay -->
    <div 
      v-show="showMobileSearch"
      class="md:hidden mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          v-model="searchQuery"
          @keydown.enter="performSearch"
          placeholder="Rechercher des fichiers..."
          class="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  viewMode: {
    type: String,
    default: 'grid'
  }
})

// Emits
const emit = defineEmits(['toggle-sidebar', 'open-search', 'set-view-mode', 'open-upload'])

// Variables réactives
const searchQuery = ref('')
const showUserMenu = ref(false)
const showMobileSearch = ref(false)
const notificationCount = ref(3)
const isDark = ref(false)
const userMenuRef = ref(null)

// Méthodes
const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const openSearch = () => {
  showMobileSearch.value = !showMobileSearch.value
  emit('open-search')
}

const setViewMode = (mode) => {
  emit('set-view-mode', mode)
}

const openUploadModal = () => {
  emit('open-upload')
}

const toggleNotifications = () => {
  // Logique pour afficher les notifications
  console.log('Toggle notifications')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Logique pour changer le thème
  document.documentElement.classList.toggle('dark', isDark.value)
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Recherche:', searchQuery.value)
    // Logique de recherche
  }
}

const handleSearchKeydown = (event) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    openSearch()
  }
}

const logout = () => {
  console.log('Déconnexion')
  // Logique de déconnexion
}

// Fermer le menu utilisateur en cliquant en dehors
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

// Raccourcis clavier globaux
const handleGlobalKeydown = (event) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    openSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleGlobalKeydown)
  
  // Détecter le thème système
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>