<script setup>
defineProps({
  plant: Object,
})
</script>

<template>
  <div
    class="rounded-[var(--radius)] bg-white p-4 shadow-sm transition hover:shadow-md active:scale-[0.98]"
  >
    <div class="flex justify-between items-start">
      <div>
        <h2 class="font-semibold text-base">{{ plant.name }}</h2>
        <p class="text-xs text-gray-400">Gieo {{ plant.date }}</p>
      </div>

      <span
        class="text-xs px-2 py-1 rounded-full bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
      >
        {{ plant.progress }}%
      </span>
    </div>

    <!-- Progress -->
    <div class="mt-4">
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-[rgb(var(--color-primary))] transition-all"
          :style="{ width: plant.progress + '%' }"
        />
      </div>
    </div>
  </div>
</template>
