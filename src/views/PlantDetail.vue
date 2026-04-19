<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlantStore } from '@/stores/plantStore'
import dayjs from 'dayjs'

const route = useRoute()
const store = usePlantStore()

onMounted(() => {
  store.load()
})

// 🌱 cây hiện tại
const plant = computed(() => store.plants.find((p) => p.id == route.params.id))

// 📅 task của cây này
const plantTasks = computed(() => store.tasks.filter((t) => t.plantId == route.params.id))

// 📊 group theo ngày
const groupedTasks = computed(() => {
  const groups = {}

  plantTasks.value.forEach((t) => {
    if (!groups[t.date]) groups[t.date] = []
    groups[t.date].push(t)
  })

  return groups
})
</script>

<template>
  <div v-if="plant" class="space-y-6">
    <!-- HEADER PLANT -->
    <div class="space-y-3">
      <img v-if="plant.image" :src="plant.image" class="w-full h-48 object-cover rounded-2xl" />

      <h1 class="text-2xl font-bold">🌱 {{ plant.name }}</h1>

      <p class="text-gray-500">
        {{ plant.stage?.name }}
      </p>

      <!-- progress -->
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-green-500 transition-all" :style="{ width: plant.progress + '%' }" />
      </div>

      <p class="text-sm text-gray-500">Tiến độ: {{ plant.progress }}%</p>
    </div>

    <!-- TASK TIMELINE -->
    <div class="space-y-4">
      <h2 class="font-semibold text-lg">📅 Lịch chăm sóc</h2>

      <div
        v-for="(tasks, date) in groupedTasks"
        :key="date"
        class="bg-white p-4 rounded-2xl shadow-sm space-y-2"
      >
        <!-- ngày -->
        <p class="text-sm font-semibold text-green-600">
          {{ date }}
        </p>

        <!-- tasks -->
        <div
          v-for="task in tasks"
          :key="task.id"
          @click="store.toggleTask(task.id)"
          class="flex justify-between items-center cursor-pointer"
        >
          <span :class="task.done ? 'line-through text-gray-400' : ''">
            {{ task.title }}
          </span>

          <span v-if="task.done">✔</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center text-gray-400 py-10">Không tìm thấy cây 🌿</div>
</template>
