<template>
  <!-- Notification Toast -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-to-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    >
      <div
        v-if="isVisible"
        class="fixed top-4 right-4 z-50 w-full max-w-sm"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                    Mise à jour disponible
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Version {{ availableVersion }}
                  </p>
                </div>
              </div>
              <button
                @click="dismissNotification"
                class="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-4 py-3">
            <div class="text-sm text-gray-700 dark:text-gray-300 mb-3">
              <p class="mb-2">{{ updateMessage }}</p>
              
              <!-- Release notes preview -->
              <div v-if="releaseNotes.length > 0" class="space-y-1">
                <p class="font-medium text-gray-900 dark:text-white text-xs">Nouveautés :</p>
                <ul class="text-xs space-y-1">
                  <li v-for="note in releaseNotes.slice(0, 3)" :key="note" class="flex items-start">
                    <span class="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <span class="text-gray-600 dark:text-gray-400">{{ note }}</span>
                  </li>
                  <li v-if="releaseNotes.length > 3" class="text-gray-500 dark:text-gray-500 text-xs italic">
                    et {{ releaseNotes.length - 3 }} autres améliorations...
                  </li>
                </ul>
              </div>
            </div>

            <!-- Progress bar (during update) -->
            <div v-if="isUpdating" class="mb-3">
              <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Installation en cours...</span>
                <span>{{ updateProgress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  :style="{ width: updateProgress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-between space-x-2">
              <div class="flex space-x-2">
                <button
                  v-if="!isUpdating && !isUpdateComplete"
                  @click="startUpdate"
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Installer</span>
                </button>

                <button
                  v-if="isUpdateComplete"
                  @click="restartApplication"
                  class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Redémarrer</span>
                </button>

                <button
                  @click="showReleaseNotes"
                  class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md transition-colors duration-200"
                >
                  Détails
                </button>
              </div>

              <button
                v-if="!isUpdating && !isUpdateComplete"
                @click="remindLater"
                class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Plus tard
              </button>
            </div>
          </div>

          <!-- Status messages -->
          <div v-if="statusMessage" class="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600">
            <p class="text-xs text-gray-600 dark:text-gray-400 flex items-center">
              <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else-if="isUpdateComplete" class="mr-2 h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ statusMessage }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Release Notes Modal -->
  <Teleport to="body">
    <div
      v-if="showReleaseModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @keydown.esc="closeReleaseModal"
    >
      <div
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        @click="closeReleaseModal"
      ></div>

      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all"
          @click.stop
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Notes de version {{ availableVersion }}
              </h3>
              <button
                @click="closeReleaseModal"
                class="rounded-md p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="px-6 py-4 max-h-96 overflow-y-auto">
            <div class="space-y-4">
              <div v-for="(category, categoryName) in groupedReleaseNotes" :key="categoryName">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <component :is="getCategoryIcon(categoryName)" class="w-4 h-4 mr-2" :class="getCategoryColor(categoryName)" />
                  {{ getCategoryTitle(categoryName) }}
                </h4>
                <ul class="space-y-1">
                  <li v-for="note in category" :key="note" class="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                    <span class="inline-block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {{ note }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
            <button
              @click="closeReleaseModal"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentVersion: {
    type: String,
    default: '1.0.0'
  },
  availableVersion: {
    type: String,
    default: '1.1.0'
  },
  updateMessage: {
    type: String,
    default: 'Une nouvelle version de DocManager est disponible avec des améliorations et corrections.'
  },
  autoInstall: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['dismiss', 'update-started', 'update-completed', 'restart-requested'])

// Variables réactives
const isVisible = ref(false)
const isUpdating = ref(false)
const isUpdateComplete = ref(false)
const updateProgress = ref(0)
const statusMessage = ref('')
const showReleaseModal = ref(false)

// Notes de version fictives
const releaseNotes = ref([
  'Amélioration de la vitesse de recherche de 40%',
  'Nouvelle interface de prévisualisation des images',
  'Support du glisser-déposer pour l\'upload',
  'Correction du bug de synchronisation',
  'Ajout du mode sombre automatique',
  'Optimisation de l\'utilisation mémoire',
  'Nouvelles options de tri et filtrage',
  'Correction des erreurs de connexion réseau'
])

// Notes groupées par catégorie
const groupedReleaseNotes = computed(() => {
  return {
    new: [
      'Nouvelle interface de prévisualisation des images',
      'Support du glisser-déposer pour l\'upload',
      'Ajout du mode sombre automatique',
      'Nouvelles options de tri et filtrage'
    ],
    improvements: [
      'Amélioration de la vitesse de recherche de 40%',
      'Optimisation de l\'utilisation mémoire'
    ],
    fixes: [
      'Correction du bug de synchronisation',
      'Correction des erreurs de connexion réseau'
    ]
  }
})

// Méthodes
const dismissNotification = () => {
  isVisible.value = false
  emit('dismiss')
}

const startUpdate = async () => {
  isUpdating.value = true
  statusMessage.value = 'Téléchargement de la mise à jour...'
  emit('update-started')

  // Simulation du processus de mise à jour
  for (let i = 0; i <= 100; i += 10) {
    updateProgress.value = i
    
    if (i === 30) {
      statusMessage.value = 'Installation des fichiers...'
    } else if (i === 70) {
      statusMessage.value = 'Configuration de la mise à jour...'
    } else if (i === 90) {
      statusMessage.value = 'Finalisation...'
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  isUpdating.value = false
  isUpdateComplete.value = true
  statusMessage.value = 'Mise à jour terminée ! Redémarrage nécessaire.'
  emit('update-completed')
}

const restartApplication = () => {
  emit('restart-requested')
  // Dans une vraie application, ceci redémarrerait l'app
  console.log('Redémarrage de l\'application...')
}

const remindLater = () => {
  dismissNotification()
  // Programmer un rappel dans X heures
  setTimeout(() => {
    if (props.show) {
      isVisible.value = true
    }
  }, 4 * 60 * 60 * 1000) // 4 heures
}

const showReleaseNotes = () => {
  showReleaseModal.value = true
}

const closeReleaseModal = () => {
  showReleaseModal.value = false
}

const getCategoryIcon = (category) => {
  const icons = {
    new: 'PlusIcon',
    improvements: 'TrendingUpIcon',
    fixes: 'ShieldCheckIcon'
  }
  return icons[category] || 'InformationCircleIcon'
}

const getCategoryColor = (category) => {
  const colors = {
    new: 'text-green-500',
    improvements: 'text-blue-500',
    fixes: 'text-orange-500'
  }
  return colors[category] || 'text-gray-500'
}

const getCategoryTitle = (category) => {
  const titles = {
    new: 'Nouveautés',
    improvements: 'Améliorations',
    fixes: 'Corrections'
  }
  return titles[category] || 'Autres'
}

// Watchers
watch(() => props.show, (newValue) => {
  isVisible.value = newValue
})

// Auto-installation si activée
watch(isVisible, (newValue) => {
  if (newValue && props.autoInstall) {
    setTimeout(() => {
      startUpdate()
    }, 2000) // Délai de 2 secondes avant l'auto-installation
  }
})

onMounted(() => {
  isVisible.value = props.show
})

// Composants d'icônes
const PlusIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>`
}

const TrendingUpIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`
}

const ShieldCheckIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`
}

const InformationCircleIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
}
</script>