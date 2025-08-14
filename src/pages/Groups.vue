<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Groupes</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="group in groups"
        :key="group.id"
        class="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer transition"
      >
        <h2 class="text-xl font-semibold mb-2">{{ group.name }}</h2>
        <p class="text-gray-600">{{ group.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const groups = ref([
  { id: 1, name: 'Administrateurs', description: 'Groupe avec tous les droits' },
  { id: 2, name: 'Éditeurs', description: 'Peut modifier les documents' },
  { id: 3, name: 'Visiteurs', description: 'Accès en lecture seule' },
])
</script>
