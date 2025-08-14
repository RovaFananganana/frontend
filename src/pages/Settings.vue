<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Paramètres</h1>
    <form class="space-y-6 max-w-md">
      <div>
        <label class="block mb-1 font-medium" for="emailNotifications">Notifications par e-mail</label>
        <input
          id="emailNotifications"
          type="checkbox"
          v-model="emailNotifications"
          class="w-5 h-5"
        />
      </div>
      <div>
        <label class="block mb-1 font-medium" for="darkMode">Mode sombre</label>
        <input
          id="darkMode"
          type="checkbox"
          v-model="darkMode"
          class="w-5 h-5"
        />
      </div>
      <button
        type="submit"
        @click.prevent="saveSettings"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
      >
        Enregistrer
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emailNotifications = ref(false)
const darkMode = ref(false)

function saveSettings() {
  alert(`Paramètres enregistrés\nNotifications: ${emailNotifications.value}\nMode sombre: ${darkMode.value}`)
  // Ajoute ta logique ici
}
</script>
