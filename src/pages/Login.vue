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
                <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="rememberMe"
              :disabled="isLoading"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
            />
            <span class="ml-2 text-sm text-gray-600"> Se souvenir de moi </span>
          </label>
          
          <a href="#" class="text-sm text-primary-600 hover:text-primary-500 transition-colors">
            Mot de passe oublié ?
          </a>
        </div>
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

<!-- <script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const message = ref('')

// le backend API URL
const API_URL = "http://127.0.0.1:5001/api/nas"   // à adapter selon la config

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
</script> -->

<!-- essai de transition -->
<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"

const username = ref("")
const password = ref("")
const rememberMe = ref(false)  
const successMessage = ref("")
const errorMessage = ref("")
const isLoading = ref(false)
const router = useRouter()

// onMounted(() => {
//   setTimeout(()=> router.replace({ name: 'Dashboard' }), 2000)
// });

const onSubmit = async () => {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''
  try {
    if (!username.value.trim() || !password.value.trim()) {
      throw new Error('Nom d’utilisateur et mot de passe requis')}
    if (!username.value.trim()) throw new Error("Le nom d'utilisateur est requis")
    if (!password.value.trim()) throw new Error("Le mot de passe est requis")

    console.log("Tentative de connexion pour:", username.value)

    const API_URL = "http://127.0.0.1:5001/api/nas"

        const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()
    console.log('Réponse du backend:', data)

    if (data.sid) {
  console.log('Connexion OK, redirection vers dashboard')
  router.push({name: 'Dashboard'})  // Assurez-vous que le nom de la route est correct
}

    // if (data.sid) {
    //   localStorage.setItem('nas_sid', data.sid)
    //   successMessage.value = data.message || 'Connexion réussie !'

    //   // Redirection vers le dashboard après 1 seconde
    //   setTimeout(() => {
    //     router.push('/dashboard')
    //   }, 1000)
    // } else {
    //   errorMessage.value = data.error || 'Erreur de connexion'
    // }
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    errorMessage.value = error.message || 'Une erreur est survenue'
  } finally {
    isLoading.value = false
  }
}
</script>