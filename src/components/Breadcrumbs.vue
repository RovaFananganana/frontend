<template>
  <nav class="flex px-5 py-3 text-gray-700 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <!-- Home -->
      <li class="inline-flex items-center">
        <router-link
          to="/"
          class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
        >
          <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
          </svg>
          Accueil
        </router-link>
      </li>

      <!-- Dynamic breadcrumb items -->
      <li v-for="(item, index) in breadcrumbItems" :key="index">
        <div class="flex items-center">
          <svg class="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
          </svg>
          
          <!-- Clickable item (not last) -->
          <router-link
            v-if="index < breadcrumbItems.length - 1"
            :to="item.path"
            class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ml-2 transition-colors duration-200 max-w-xs truncate"
            :title="item.name"
          >
            {{ item.name }}
          </router-link>
          
          <!-- Current page (last item) -->
          <span
            v-else
            class="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2 max-w-xs truncate"
            :title="item.name"
          >
            {{ item.name }}
          </span>
        </div>
      </li>
    </ol>

    <!-- Actions on the right -->
    <div class="ml-auto flex items-center space-x-2">
      <!-- Quick actions -->
      <div class="hidden md:flex items-center space-x-1">
        <button
          @click="goBack"
          :disabled="!canGoBack"
          :class="canGoBack ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'"
          class="p-1.5 rounded-md transition-colors duration-200"
          title="Retour"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          @click="goForward"
          :disabled="!canGoForward"
          :class="canGoForward ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'"
          class="p-1.5 rounded-md transition-colors duration-200"
          title="Suivant"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          @click="refreshCurrentPath"
          class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-200"
          title="Actualiser"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <!-- Dropdown menu for more actions -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-200"
          title="Plus d'actions"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        <!-- Dropdown content -->
        <div
          v-show="showDropdown"
          class="absolute right-0 z-50 mt-2 w-48 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
          @click.stop
        >
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <button
                @click="copyCurrentPath"
                class="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copier le chemin
              </button>
            </li>
            <li>
              <button
                @click="addToBookmarks"
                class="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Ajouter aux favoris
              </button>
            </li>
            <li>
              <button
                @click="shareCurrentPath"
                class="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Partager
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Props
const props = defineProps({
  customItems: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['path-copied', 'bookmark-added', 'path-shared'])

// Composables
const route = useRoute()
const router = useRouter()

// Variables réactives
const showDropdown = ref(false)
const dropdownRef = ref(null)
const navigationHistory = ref([])
const currentHistoryIndex = ref(-1)

// Computed
const breadcrumbItems = computed(() => {
  if (props.customItems.length > 0) {
    return props.customItems
  }

  const pathSegments = route.path.split('/').filter(segment => segment)
  const items = []
  let currentPath = ''

  pathSegments.forEach((segment, index) => {
    currentPath += '/' + segment
    
    // Mapping des segments vers des noms lisibles
    const nameMapping = {
      'files': 'Fichiers',
      'documents': 'Documents',
      'images': 'Images',
      'videos': 'Vidéos',
      'archives': 'Archives',
      'trash': 'Corbeille',
      'folders': 'Dossiers',
      'projects': 'Projets',
      'family-photos': 'Photos famille',
      'invoices': 'Factures',
      'backup': 'Sauvegarde'
    }

    items.push({
      name: nameMapping[segment] || decodeURIComponent(segment),
      path: currentPath
    })
  })

  return items
})

const canGoBack = computed(() => currentHistoryIndex.value > 0)
const canGoForward = computed(() => currentHistoryIndex.value < navigationHistory.value.length - 1)

const currentPath = computed(() => route.path)

// Méthodes
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const goBack = () => {
  if (canGoBack.value) {
    currentHistoryIndex.value--
    router.push(navigationHistory.value[currentHistoryIndex.value])
  }
}

const goForward = () => {
  if (canGoForward.value) {
    currentHistoryIndex.value++
    router.push(navigationHistory.value[currentHistoryIndex.value])
  }
}

const refreshCurrentPath = () => {
  router.go(0) // Recharge la page courante
}

const copyCurrentPath = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    emit('path-copied', currentPath.value)
    showDropdown.value = false
    // Afficher une notification de succès
    console.log('Chemin copié dans le presse-papiers')
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
  }
}

const addToBookmarks = () => {
  const currentItem = breadcrumbItems.value[breadcrumbItems.value.length - 1]
  emit('bookmark-added', {
    name: currentItem?.name || 'Page actuelle',
    path: currentPath.value
  })
  showDropdown.value = false
  console.log('Ajouté aux favoris')
}

const shareCurrentPath = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Partager ce dossier',
      url: window.location.href
    }).catch(console.error)
  } else {
    copyCurrentPath() // Fallback: copier le lien
  }
  emit('path-shared', currentPath.value)
  showDropdown.value = false
}

// Gestion de l'historique de navigation
const addToHistory = (path) => {
  // Supprimer les éléments après l'index actuel
  navigationHistory.value = navigationHistory.value.slice(0, currentHistoryIndex.value + 1)
  
  // Ajouter le nouveau chemin
  if (navigationHistory.value[navigationHistory.value.length - 1] !== path) {
    navigationHistory.value.push(path)
    currentHistoryIndex.value = navigationHistory.value.length - 1
  }
}

// Fermer le dropdown en cliquant en dehors
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// Watchers
watch(() => route.path, (newPath) => {
  addToHistory(newPath)
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>