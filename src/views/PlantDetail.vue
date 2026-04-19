<script setup>
import { useRoute } from 'vue-router'
import { usePlantStore } from '@/stores/plantStore'
import { computed } from 'vue'

const route = useRoute()
const store = usePlantStore()

const plant = computed(() => store.plants.find((p) => p.id == route.params.id))
</script>

<template>
  <div v-if="plant" class="space-y-4">
    <img v-if="plant.image" :src="plant.image" class="w-full h-56 object-cover rounded-2xl" />

    <h1 class="text-2xl font-bold">
      {{ plant.name }}
    </h1>

    <p class="text-gray-500">
      {{ plant.stage?.name }}
    </p>

    <div class="bg-white p-4 rounded-2xl shadow-sm">
      <p>📊 Progress: {{ plant.progress }}%</p>
    </div>
  </div>
</template>
