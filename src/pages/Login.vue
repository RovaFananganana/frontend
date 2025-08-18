<template>
  <!-- <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4"> -->
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-900">Connexion</h1>
      <form @submit.prevent="onSubmit" class="space-y-5">
        <input
          type="text"
          placeholder="Nom d’utilisateur"
          v-model="username"
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
  <!-- </div> -->
</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const message = ref('')

// ton backend Flask (pas directement le NAS !)
const API_URL = "http://127.0.0.1:5001/api/auth"   // à adapter selon la config

async function onSubmit() {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()
    console.log("Réponse backend:", data)

    if (response.ok && data.sid) {
      localStorage.setItem("sid", data.sid)   // on sauvegarde le SID
      message.value = "Connexion réussie ✅"
    } else {
      message.value = data.error || "Erreur de connexion"
    }
  } catch (err) {
    message.value = "Erreur : " + err.message
  }
}
</script>