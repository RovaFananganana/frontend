<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Fichiers</h1>
    <table class="min-w-full bg-white rounded-lg shadow">
      <thead>
        <tr>
          <th class="py-3 px-6 text-left border-b border-gray-200">Nom</th>
          <th class="py-3 px-6 text-left border-b border-gray-200">Taille</th>
          <th class="py-3 px-6 text-left border-b border-gray-200">Date</th>
          <th class="py-3 px-6 text-left border-b border-gray-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" :key="file.id" class="hover:bg-gray-100 cursor-pointer">
          <td class="py-3 px-6 border-b border-gray-200">{{ file.name }}</td>
          <td class="py-3 px-6 border-b border-gray-200">{{ file.size }}</td>
          <td class="py-3 px-6 border-b border-gray-200">{{ file.date }}</td>
          <td class="py-3 px-6 border-b border-gray-200">
            <button class="text-blue-600 hover:underline">Télécharger</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([
  { id: 1, name: 'Document_1.pdf', size: '2.1 MB', date: '2025-08-10' },
  { id: 2, name: 'Photo.png', size: '1.4 MB', date: '2025-08-08' },
  { id: 3, name: 'Archive.zip', size: '10.2 MB', date: '2025-07-30' },
])
</script>
