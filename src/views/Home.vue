<script setup>
import { onMounted } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import PlantCard from '@/components/plant/PlantCard.vue'

const store = usePlantStore()

onMounted(() => {
  store.load()
})
</script>

<template>
  <div class="space-y-3">
    <PlantCard
      v-for="p in store.plants"
      :key="p.id"
      :plant="{
        ...p,
        progress: 50,
      }"
    />
  </div>
</template>
