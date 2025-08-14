<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <h1 class="text-9xl font-extrabold text-blue-600 mb-6 select-none">404</h1>
    <h2 class="text-3xl font-semibold mb-4 text-gray-800">Oups ! Page non trouvée</h2>
    <p class="text-gray-600 mb-8 max-w-md text-center">
      La page que vous recherchez n’existe pas ou a été déplacée.
    </p>
    <router-link
      to="/"
      class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
    >
      Retour à l'accueil
    </router-link>
  </div>
</template>

<script setup>
</script>
