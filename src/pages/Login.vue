<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-900">Connexion</h1>
      <form @submit.prevent="onSubmit" class="space-y-5">
        <input
          type="email"
          placeholder="Email"
          v-model="email"
          required
          class="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          v-model="password"
          required
          class="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function onSubmit() {
  alert(`Connexion : ${email.value}`)
  // Remplace par ta logique d’authentification
}
</script>
