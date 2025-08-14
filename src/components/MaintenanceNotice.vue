<template>
  <div
    v-if="visible"
    class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-md flex items-center justify-between"
    role="alert"
  >
    <div class="flex items-center space-x-3">
      <svg
        class="w-6 h-6 text-yellow-600 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <div>
        <p class="font-semibold">Maintenance programmée</p>
        <p class="text-sm">
          {{ message }}
          <span v-if="formattedTime"> - prévue à {{ formattedTime }}</span>
        </p>
      </div>
    </div>

    <button
      @click="$emit('dismiss')"
      aria-label="Fermer"
      class="text-yellow-600 hover:text-yellow-800 focus:outline-none"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  // Message de maintenance (string)
  message: {
    type: String,
    required: true,
  },
  // Heure prévue (ISO string ou null)
  scheduledTime: {
    type: [String, null],
    default: null,
  },
  // Contrôle visibilité (booléen)
  visible: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['dismiss'])

// Formatage de la date/heure si présente
const formattedTime = computed(() => {
  if (!props.scheduledTime) return ''
  const date = new Date(props.scheduledTime)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<style scoped>
/* Tu peux ajouter ou modifier les animations ou styles ici */
</style>
