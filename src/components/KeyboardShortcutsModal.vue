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
          class="relative w-full max-w-4xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all"
          @click.stop
        >
          <!-- Modal header -->
          <div class="border-b border-gray-200 dark:border-gray-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Raccourcis clavier
                </h3>
              </div>
              <button
                @click="closeModal"
                class="rounded-md p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="px-6 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Navigation section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Navigation
                </h4>
                <div class="space-y-3">
                  <div v-for="shortcut in navigationShortcuts" :key="shortcut.keys" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ shortcut.description }}</span>
                    <div class="flex items-center space-x-1">
                      <kbd
                        v-for="key in shortcut.keys.split('+')"
                        :key="key"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {{ key.trim() }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- File operations section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Opérations sur les fichiers
                </h4>
                <div class="space-y-3">
                  <div v-for="shortcut in fileOperationShortcuts" :key="shortcut.keys" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ shortcut.description }}</span>
                    <div class="flex items-center space-x-1">
                      <kbd
                        v-for="key in shortcut.keys.split('+')"
                        :key="key"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {{ key.trim() }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selection section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sélection
                </h4>
                <div class="space-y-3">
                  <div v-for="shortcut in selectionShortcuts" :key="shortcut.keys" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ shortcut.description }}</span>
                    <div class="flex items-center space-x-1">
                      <kbd
                        v-for="key in shortcut.keys.split('+')"
                        :key="key"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {{ key.trim() }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Affichage
                </h4>
                <div class="space-y-3">
                  <div v-for="shortcut in viewShortcuts" :key="shortcut.keys" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ shortcut.description }}</span>
                    <div class="flex items-center space-x-1">
                      <kbd
                        v-for="key in shortcut.keys.split('+')"
                        :key="key"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {{ key.trim() }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- General section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Général
                </h4>
                <div class="space-y-3">
                  <div v-for="shortcut in generalShortcuts" :key="shortcut.keys" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ shortcut.description }}</span>
                    <div class="flex items-center space-x-1">
                      <kbd
                        v-for="key in shortcut.keys.split('+')"
                        :key="key"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {{ key.trim() }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Advanced section -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Avancé
                </h4>
                <div class="space-y-3">
                  <div v-for="shortcut in advancedShortcuts" :key="shortcut.keys" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ shortcut.description }}</span>
                    <div class="flex items-center space-x-1">
                      <kbd
                        v-for="key in shortcut.keys.split('+')"
                        :key="key"
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                      >
                        {{ key.trim() }}
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with tips -->
          <div class="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-6 py-4">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Conseils d'utilisation
                </h5>
                <div class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p>• Les raccourcis peuvent être utilisés simultanément avec d'autres actions</p>
                  <p>• Maintenez <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">Shift</kbd> pour étendre les sélections</p>
                  <p>• Appuyez sur <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">?</kbd> n'importe où pour afficher cette aide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Raccourcis de navigation
const navigationShortcuts = ref([
  { keys: 'Ctrl + K', description: 'Ouvrir la recherche' },
  { keys: '↑ ↓', description: 'Naviguer dans les fichiers' },
  { keys: '←', description: 'Dossier parent' },
  { keys: '→', description: 'Entrer dans le dossier' },
  { keys: 'Home', description: 'Premier fichier' },
  { keys: 'End', description: 'Dernier fichier' },
  { keys: 'Page Up', description: 'Page précédente' },
  { keys: 'Page Down', description: 'Page suivante' }
])

// Raccourcis d'opérations sur fichiers
const fileOperationShortcuts = ref([
  { keys: 'Ctrl + N', description: 'Nouveau dossier' },
  { keys: 'Ctrl + U', description: 'Upload de fichiers' },
  { keys: 'Ctrl + C', description: 'Copier' },
  { keys: 'Ctrl + X', description: 'Couper' },
  { keys: 'Ctrl + V', description: 'Coller' },
  { keys: 'Delete', description: 'Supprimer' },
  { keys: 'F2', description: 'Renommer' },
  { keys: 'Enter', description: 'Ouvrir' }
])

// Raccourcis de sélection
const selectionShortcuts = ref([
  { keys: 'Ctrl + A', description: 'Tout sélectionner' },
  { keys: 'Ctrl + D', description: 'Tout désélectionner' },
  { keys: 'Ctrl + I', description: 'Inverser la sélection' },
  { keys: 'Shift + ↑↓', description: 'Sélection étendue' },
  { keys: 'Ctrl + Click', description: 'Sélection multiple' },
  { keys: 'Shift + Click', description: 'Sélection continue' },
  { keys: 'Space', description: 'Basculer la sélection' },
  { keys: 'Escape', description: 'Annuler la sélection' }
])

// Raccourcis d'affichage
const viewShortcuts = ref([
  { keys: 'Ctrl + 1', description: 'Vue liste' },
  { keys: 'Ctrl + 2', description: 'Vue grille' },
  { keys: 'Ctrl + 3', description: 'Vue détails' },
  { keys: 'Ctrl + +', description: 'Zoom avant' },
  { keys: 'Ctrl + -', description: 'Zoom arrière' },
  { keys: 'Ctrl + 0', description: 'Réinitialiser le zoom' },
  { keys: 'F5', description: 'Actualiser' },
  { keys: 'F11', description: 'Plein écran' }
])

// Raccourcis généraux
const generalShortcuts = ref([
  { keys: 'Ctrl + Z', description: 'Annuler' },
  { keys: 'Ctrl + Y', description: 'Rétablir' },
  { keys: 'Ctrl + S', description: 'Sauvegarder' },
  { keys: 'Ctrl + P', description: 'Imprimer' },
  { keys: 'Ctrl + F', description: 'Rechercher dans la page' },
  { keys: 'Ctrl + R', description: 'Actualiser la page' },
  { keys: 'Alt + F4', description: 'Fermer l\'application' },
  { keys: '?', description: 'Afficher cette aide' }
])

// Raccourcis avancés
const advancedShortcuts = ref([
  { keys: 'Ctrl + Shift + N', description: 'Nouveau fichier' },
  { keys: 'Ctrl + Shift + C', description: 'Copier le chemin' },
  { keys: 'Ctrl + Shift + V', description: 'Coller sans formatage' },
  { keys: 'Ctrl + Shift + Delete', description: 'Suppression définitive' },
  { keys: 'Ctrl + Shift + R', description: 'Actualisation forcée' },
  { keys: 'Ctrl + Alt + T', description: 'Changer le thème' },
  { keys: 'Ctrl + Alt + S', description: 'Paramètres' },
  { keys: 'Ctrl + Shift + I', description: 'Outils de développement' }
])

// Méthodes
const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>