<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      @click.self="close"
    >
      <div
        class="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        <h3
          id="notif-title"
          class="text-lg font-semibold mb-4"
          :class="titleClass"
        >
          {{ title }}
        </h3>
        <p class="mb-6">{{ message }}</p>
        <div class="flex justify-end">
          <button
            @click="close"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  type: { type: String, default: 'info' }, // 'info', 'success', 'warning', 'error'
  title: { type: String, default: '' },
  message: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

const titleClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'error':
      return 'text-red-600'
    default:
      return 'text-blue-600'
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>