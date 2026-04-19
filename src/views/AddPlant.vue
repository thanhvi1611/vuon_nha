<script setup>
import { ref } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import { useRouter } from 'vue-router'

const store = usePlantStore()
const router = useRouter()

const name = ref('')
const date = ref('')

async function add() {
  if (!name.value || !date.value) return

  await store.addPlant({
    name: name.value,
    startDate: date.value,
    type: 'custom',
  })

  router.push('/')
}
</script>

<template>
  <div class="space-y-3">
    <input v-model="name" placeholder="Tên cây" class="input" />
    <input v-model="date" type="date" class="input" />

    <button @click="add" class="btn-primary">Thêm cây</button>
  </div>
</template>
