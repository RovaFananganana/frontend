<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @keydown.esc="closeModal"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="closeModal"
      ></div>

      <!-- Modal container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all"
          @click.stop
        >
          <!-- Modal header -->
          <div class="border-b border-gray-200 dark:border-gray-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Recherche avancée
              </h3>
              <button
                @click="closeModal"
                class="rounded-md p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Search input -->
          <div class="px-6 py-4">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref="searchInput"
                v-model="searchQuery"
                @input="performSearch"
                @keydown="handleKeydown"
                type="text"
                placeholder="Rechercher des fichiers et dossiers..."
                class="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
            </div>

            <!-- Search filters -->
            <div class="mt-4 flex flex-wrap gap-2">
              <button
                v-for="filter in quickFilters"
                :key="filter.key"
                @click="toggleFilter(filter)"
                :class="activeFilters.includes(filter.key) 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'"
                class="px-3 py-1 text-sm font-medium border rounded-full transition-colors duration-200"
              >
                <component :is="filter.icon" class="w-4 h-4 inline mr-1" />
                {{ filter.label }}
              </button>
            </div>
          </div>

          <!-- Results -->
          <div class="max-h-96 overflow-y-auto border-t border-gray-200 dark:border-gray-600">
            <!-- Loading state -->
            <div v-if="isSearching" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-3 text-gray-600 dark:text-gray-400">Recherche en cours...</span>
            </div>

            <!-- No results -->
            <div v-else-if="searchQuery && searchResults.length === 0" class="py-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">Aucun résultat</h3>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Aucun fichier ou dossier ne correspond à votre recherche.
              </p>
            </div>

            <!-- Results list -->
            <div v-else-if="searchResults.length > 0">
              <!-- Recent searches -->
              <div v-if="!searchQuery && recentSearches.length > 0" class="px-6 py-3">
                <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Recherches récentes
                </h4>
                <div class="space-y-1">
                  <button
                    v-for="recent in recentSearches"
                    :key="recent"
                    @click="searchQuery = recent; performSearch()"
                    class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ recent }}
                  </button>
                </div>
              </div>

              <!-- Search results -->
              <div v-if="searchQuery" class="divide-y divide-gray-200 dark:divide-gray-600">
                <div
                  v-for="(result, index) in searchResults"
                  :key="result.id"
                  @click="selectResult(result)"
                  @mouseenter="selectedIndex = index"
                  :class="selectedIndex === index ? 'bg-gray-50 dark:bg-gray-700' : ''"
                  class="px-6 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <!-- File icon -->
                    <div class="flex-shrink-0">
                      <component :is="getFileIcon(result.type)" class="w-8 h-8" :class="getFileIconColor(result.type)" />
                    </div>
                    
                    <!-- File info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate" v-html="highlightMatch(result.name)"></p>
                        <span v-if="result.isFolder" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          Dossier
                        </span>
                      </div>
                      <div class="flex items-center space-x-4 mt-1">
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ result.path }}</p>
                        <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatFileSize(result.size) }}</span>
                        <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDate(result.modified) }}</span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex-shrink-0">
                      <button
                        @click.stop="toggleFavorite(result)"
                        class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                      >
                        <svg class="w-4 h-4" :class="result.isFavorite ? 'text-yellow-500' : ''" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with shortcuts -->
          <div class="border-t border-gray-200 dark:border-gray-600 px-6 py-3 bg-gray-50 dark:bg-gray-800">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-4">
                <span class="flex items-center">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 mr-1">↵</kbd>
                  ouvrir
                </span>
                <span class="flex items-center">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 mr-1">↑↓</kbd>
                  naviguer
                </span>
                <span class="flex items-center">
                  <kbd class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 mr-1">esc</kbd>
                  fermer
                </span>
              </div>
              <div class="text-right">
                {{ searchResults.length }} résultat{{ searchResults.length > 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'file-selected'])

// Composables
const router = useRouter()

// Variables réactives
const searchInput = ref(null)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const selectedIndex = ref(-1)
const activeFilters = ref([])
const recentSearches = ref(['Documents PDF', 'Photos 2023', 'Factures', 'Projets'])

// Filtres rapides
const quickFilters = ref([
  { key: 'documents', label: 'Documents', icon: 'DocumentIcon' },
  { key: 'images', label: 'Images', icon: 'PhotoIcon' },
  { key: 'videos', label: 'Vidéos', icon: 'VideoIcon' },
  { key: 'recent', label: 'Récents', icon: 'ClockIcon' },
  { key: 'favorites', label: 'Favoris', icon: 'StarIcon' }
])

// Données fictives pour la démonstration
const mockFiles = ref([
  {
    id: 1,
    name: 'Rapport_annuel_2023.pdf',
    type: 'pdf',
    path: '/Documents/Rapports',
    size: 2048576,
    modified: new Date('2023-12-15'),
    isFolder: false,
    isFavorite: true
  },
  {
    id: 2,
    name: 'Photos_vacances',
    type: 'folder',
    path: '/Images/Vacances',
    size: 0,
    modified: new Date('2023-08-20'),
    isFolder: true,
    isFavorite: false
  },
  {
    id: 3,
    name: 'presentation_projet.pptx',
    type: 'pptx',
    path: '/Documents/Présentations',
    size: 5242880,
    modified: new Date('2023-11-10'),
    isFolder: false,
    isFavorite: false
  },
  {
    id: 4,
    name: 'video_demo.mp4',
    type: 'mp4',
    path: '/Vidéos/Démos',
    size: 104857600,
    modified: new Date('2023-10-25'),
    isFolder: false,
    isFavorite: true
  }
])

// Méthodes
const closeModal = () => {
  emit('close')
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = -1
  activeFilters.value = []
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  // Simuler une recherche avec délai
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase()
    let results = mockFiles.value.filter(file =>
      file.name.toLowerCase().includes(query) ||
      file.path.toLowerCase().includes(query)
    )

    // Appliquer les filtres actifs
    if (activeFilters.value.length > 0) {
      results = results.filter(file => {
        return activeFilters.value.some(filter => {
          switch (filter) {
            case 'documents':
              return ['pdf', 'docx', 'xlsx', 'pptx', 'txt'].includes(file.type)
            case 'images':
              return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(file.type)
            case 'videos':
              return ['mp4', 'avi', 'mov', 'mkv'].includes(file.type)
            case 'recent':
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return file.modified > weekAgo
            case 'favorites':
              return file.isFavorite
            default:
              return true
          }
        })
      })
    }

    searchResults.value = results
    selectedIndex.value = results.length > 0 ? 0 : -1
    isSearching.value = false

    // Ajouter à l'historique des recherches
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      recentSearches.value = recentSearches.value.slice(0, 5)
    }
  }, 300)
}

const toggleFilter = (filter) => {
  const index = activeFilters.value.indexOf(filter.key)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filter.key)
  }
  performSearch()
}

const selectResult = (result) => {
  emit('file-selected', result)
  
  if (result.isFolder) {
    router.push(result.path)
  } else {
    // Ouvrir le fichier (logique spécifique à votre application)
    console.log('Ouvrir le fichier:', result)
  }
  
  closeModal()
}

const toggleFavorite = (result) => {
  result.isFavorite = !result.isFavorite
  // Ici, vous pouvez ajouter la logique pour persister ce changement
}

const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && searchResults.value[selectedIndex.value]) {
        selectResult(searchResults.value[selectedIndex.value])
      }
      break
    case 'Escape':
      closeModal()
      break
  }
}

const highlightMatch = (text) => {
  if (!searchQuery.value) return text
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}

const getFileIcon = (type) => {
  const iconMap = {
    folder: 'FolderIcon',
    pdf: 'DocumentTextIcon',
    docx: 'DocumentTextIcon',
    xlsx: 'DocumentChartBarIcon',
    pptx: 'PresentationChartBarIcon',
    txt: 'DocumentTextIcon',
    jpg: 'PhotoIcon',
    jpeg: 'PhotoIcon',
    png: 'PhotoIcon',
    gif: 'PhotoIcon',
    mp4: 'VideoIcon',
    avi: 'VideoIcon',
    mov: 'VideoIcon'
  }
  return iconMap[type] || 'DocumentIcon'
}

const getFileIconColor = (type) => {
  const colorMap = {
    folder: 'text-blue-500',
    pdf: 'text-red-500',
    docx: 'text-blue-600',
    xlsx: 'text-green-600',
    pptx: 'text-orange-500',
    txt: 'text-gray-500',
    jpg: 'text-purple-500',
    jpeg: 'text-purple-500',
    png: 'text-purple-500',
    gif: 'text-purple-500',
    mp4: 'text-red-600',
    avi: 'text-red-600',
    mov: 'text-red-600'
  }
  return colorMap[type] || 'text-gray-400'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return ''
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

// Watchers
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    searchInput.value?.focus()
  }
})

watch(activeFilters, () => {
  if (searchQuery.value) {
    performSearch()
  }
}, { deep: true })

// Composants d'icônes
const DocumentIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
}

const DocumentTextIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
}

const PhotoIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
}

const VideoIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
}

const ClockIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
}

const StarIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`
}

const FolderIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/></svg>`
}

const DocumentChartBarIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
}

const PresentationChartBarIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1zM9 12l2 2 4-4"/></svg>`
}
</script>

<style scoped>
mark {
  @apply bg-yellow-200 dark:bg-yellow-800;
}
</style>