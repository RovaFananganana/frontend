<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Utilisateurs</h1>
    <ul class="divide-y divide-gray-200">
      <li v-for="user in users" :key="user.id" class="py-4 flex justify-between items-center">
        <div>
          <p class="font-semibold">{{ user.name }}</p>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>
        <button
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          @click="deleteUser(user.id)"
        >
          Supprimer
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice Dupont', email: 'alice@example.com' },
  { id: 2, name: 'Bob Martin', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Durand', email: 'charlie@example.com' },
])

function deleteUser(id) {
  alert(`Supprimer l'utilisateur avec ID ${id}`)
  // Ajoute ta logique ici
}
</script>
