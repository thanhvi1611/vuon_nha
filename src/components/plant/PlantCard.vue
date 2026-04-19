<script setup>
import { usePlantStore } from '@/stores/plantStore'

const props = defineProps({
  plant: Object,
})

const store = usePlantStore()

async function remove() {
  const ok = confirm(`Xóa cây "${props.plant.name}"?`)
  if (!ok) return

  await store.deletePlant(props.plant.id)
}
</script>

<template>
  <div class="bg-white rounded-2xl p-4 shadow-sm transition hover:shadow-md relative">
    <!-- Nút xóa -->
    <button
      @click.stop="remove"
      class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition"
    >
      🗑️
    </button>

    <!-- Header -->
    <div class="flex justify-between items-start pr-10">
      <div>
        <h2 class="font-semibold text-lg text-gray-900">
          {{ plant.name }}
        </h2>

        <p class="text-sm text-gray-500">
          {{ plant.stage?.name }}
        </p>
      </div>

      <!-- % progress -->
      <span
        class="text-sm font-medium px-2 py-1 rounded-full bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
      >
        {{ plant.progress }}%
      </span>
    </div>

    <!-- Progress bar -->
    <div class="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-[rgb(var(--color-primary))] transition-all"
        :style="{ width: plant.progress + '%' }"
      />
    </div>
  </div>
</template>
