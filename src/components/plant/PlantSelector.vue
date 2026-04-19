<script setup>
import { ref } from 'vue'
import { plantTemplates } from '@/data/plants'

const emit = defineEmits(['select'])

const selected = ref(null)

function selectPlant(plant) {
  selected.value = plant.id
  emit('select', plant.id)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="plant in plantTemplates"
      :key="plant.id"
      @click="selectPlant(plant)"
      class="p-4 rounded-2xl border bg-white flex flex-col items-center justify-center text-center cursor-pointer transition active:scale-95"
      :class="
        selected === plant.id
          ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.1)]'
          : 'border-gray-200'
      "
    >
      <!-- Icon -->
      <div class="text-3xl mb-2">🌿</div>

      <!-- Name -->
      <p class="font-medium text-base text-gray-900">
        {{ plant.name }}
      </p>

      <!-- Duration -->
      <p class="text-sm text-gray-500">{{ plant.duration }} ngày</p>
    </div>
  </div>
</template>
