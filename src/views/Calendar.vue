<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import dayjs from 'dayjs'

const store = usePlantStore()

// 📌 Today
const today = dayjs().format('YYYY-MM-DD')

// 📅 Selected date
const selectedDate = ref(today)

// 🚀 Load data
onMounted(() => {
  store.load()
})

// ⚡ Map cây → O(1) lookup (tối ưu performance)
const plantMap = computed(() => {
  const map = {}
  store.plants.forEach((p) => {
    map[p.id] = p
  })
  return map
})

// 📌 Tasks theo ngày
const tasksByDate = computed(() => {
  return store.tasks.filter((t) => t.date === selectedDate.value)
})

// 🎯 Toggle task
function toggle(taskId) {
  store.toggleTask(taskId)
}
</script>

<template>
  <div class="space-y-5">
    <!-- HEADER -->
    <div>
      <h1 class="text-xl font-bold">📅 Lịch chăm sóc</h1>
      <p class="text-sm text-gray-500">Chọn ngày để xem việc cần làm</p>
    </div>

    <!-- DATE PICKER -->
    <div>
      <input
        type="date"
        v-model="selectedDate"
        class="input w-full"
        :class="selectedDate === today ? 'ring-2 ring-green-400 bg-green-50' : ''"
      />

      <!-- Badge hôm nay -->
      <p v-if="selectedDate === today" class="text-green-600 text-sm font-medium mt-1">Hôm nay</p>
    </div>

    <!-- TASK LIST -->
    <div v-if="tasksByDate.length" class="space-y-3">
      <div
        v-for="task in tasksByDate"
        :key="task.id"
        @click="toggle(task.id)"
        class="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center cursor-pointer transition active:scale-95 hover:shadow-md"
      >
        <!-- LEFT -->
        <div>
          <p
            class="font-medium text-base"
            :class="task.done ? 'line-through text-gray-400' : 'text-gray-900'"
          >
            {{ task.title }}
          </p>

          <!-- tên cây -->
          <p class="text-sm text-gray-500">
            {{ plantMap[task.plantId]?.name || '---' }}
          </p>
        </div>

        <!-- RIGHT (status) -->
        <div
          class="w-6 h-6 rounded-full border flex items-center justify-center transition"
          :class="task.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'"
        >
          ✔
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="text-center text-gray-400 py-12">
      <p class="text-lg">🎉 Không có việc nào</p>
      <p class="text-sm mt-1">Nghỉ ngơi thôi 😄</p>
    </div>
  </div>
</template>
