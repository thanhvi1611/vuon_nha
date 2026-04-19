<script setup>
import { onMounted } from 'vue'
import { usePlantStore } from '@/stores/plantStore'

const store = usePlantStore()

onMounted(() => {
  store.load()
})
</script>

<template>
  <div class="space-y-3">
    <div v-for="task in store.tasks" :key="task.id" class="bg-white p-4 rounded-xl shadow-sm">
      <p class="font-medium">{{ task.title }}</p>
      <p class="text-xs text-gray-400">{{ task.date }}</p>
    </div>
  </div>
</template>
