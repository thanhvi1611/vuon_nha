<script setup>
import { ref } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import { useRouter } from 'vue-router'
import PlantSelector from '@/components/plant/PlantSelector.vue'
import { plantTemplates } from '@/data/plants'

const store = usePlantStore()
const router = useRouter()

const type = ref('')
const date = ref('')

async function add() {
  if (!type.value || !date.value) return

  const template = plantTemplates.find((p) => p.id === type.value)

  await store.addPlant({
    name: template.name,
    type: template.id,
    startDate: date.value,
  })

  router.push('/')
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold">🌱 Chọn cây</h1>

    <PlantSelector @select="(val) => (type = val)" />

    <input v-model="date" type="date" class="input" />

    <button class="btn-primary" @click="add">Thêm cây</button>
  </div>
</template>
