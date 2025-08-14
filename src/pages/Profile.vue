<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Profil utilisateur</h1>
    <form class="space-y-6">
      <div>
        <label class="block mb-1 font-medium" for="name">Nom complet</label>
        <input
          id="name"
          type="text"
          v-model="name"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block mb-1 font-medium" for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        @click.prevent="updateProfile"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
      >
        Mettre à jour
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('Jean Dupont')
const email = ref('jean.dupont@example.com')

function updateProfile() {
  alert(`Profil mis à jour\nNom: ${name.value}\nEmail: ${email.value}`)
  // Ajoute ta logique ici
}
</script>
