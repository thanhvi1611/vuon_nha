<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import dayjs from 'dayjs'

const store = usePlantStore()

import { startAutoNotification } from '@/utils/autoNotify'

let stopNotify = null

onMounted(() => {
  stopNotify = startAutoNotification()
})

onUnmounted(() => {
  if (stopNotify) stopNotify()
})
// ==================== TIME ====================
const today = computed(() => dayjs())
const currentMonth = ref(dayjs())
const selectedDate = ref(today.value.format('YYYY-MM-DD'))

// ==================== COMPUTED ====================
const plantMap = computed(() => {
  const map = {}
  store.plants.forEach((p) => {
    map[p.id] = p
  })
  return map
})

const tasksByDate = computed(() => {
  return store.tasks.filter((t) => t.date === selectedDate.value)
})

const groupedTasks = computed(() => {
  const groups = {}
  tasksByDate.value.forEach((task) => {
    const plantId = task.plantId
    if (!groups[plantId]) groups[plantId] = []
    groups[plantId].push(task)
  })
  return groups
})

const days = computed(() => {
  const startOfMonth = currentMonth.value.startOf('month')
  const endOfMonth = currentMonth.value.endOf('month')
  const startDay = startOfMonth.day()

  const arr = []
  for (let i = 0; i < startDay; i++) arr.push(null)
  for (let d = 1; d <= endOfMonth.date(); d++) {
    arr.push(startOfMonth.date(d))
  }
  return arr
})

// ==================== METHODS ====================
function hasTask(date) {
  if (!date) return false
  const dateStr = date.format('YYYY-MM-DD')
  return store.tasks.some((t) => t.date === dateStr && !t.done)
}

function nextMonth() {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

function prevMonth() {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

function selectDate(day) {
  if (day) selectedDate.value = day.format('YYYY-MM-DD')
}

// ==================== INIT ====================
</script>

<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center px-1">
      <button
        @click="prevMonth"
        class="w-10 h-10 flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 rounded-xl transition"
      >
        ‹
      </button>

      <h2 class="text-xl font-semibold text-gray-800">
        {{ currentMonth.format('MM/YYYY') }}
      </h2>

      <button
        @click="nextMonth"
        class="w-10 h-10 flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-100 rounded-xl transition"
      >
        ›
      </button>
    </div>

    <!-- WEEKDAY -->
    <div class="grid grid-cols-7 text-center text-sm font-medium text-gray-400">
      <div class="py-1">CN</div>
      <div class="py-1">T2</div>
      <div class="py-1">T3</div>
      <div class="py-1">T4</div>
      <div class="py-1">T5</div>
      <div class="py-1">T6</div>
      <div class="py-1">T7</div>
    </div>

    <!-- CALENDAR -->
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, i) in days"
        :key="i"
        class="h-14 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all active:scale-95"
        :class="[
          day ? 'bg-white shadow-sm hover:shadow' : 'bg-transparent',
          day && day.format('YYYY-MM-DD') === selectedDate
            ? 'ring-2 ring-green-500 bg-green-50'
            : '',
          day && day.isSame(today, 'day') ? 'bg-green-100 font-medium' : '',
        ]"
        @click="selectDate(day)"
      >
        <span
          v-if="day"
          class="text-base"
          :class="day.isSame(today, 'day') ? 'text-green-600' : 'text-gray-700'"
        >
          {{ day.date() }}
        </span>

        <span v-if="day && hasTask(day)" class="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
      </div>
    </div>

    <!-- TASK LIST -->
    <div class="space-y-4">
      <div
        v-for="(tasks, plantId) in groupedTasks"
        :key="plantId"
        class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100"
      >
        <h3 class="font-semibold text-green-700 mb-3 flex items-center gap-2">
          🌱 {{ plantMap[plantId]?.name }}
        </h3>

        <div class="space-y-3">
          <div
            v-for="task in tasks"
            :key="task.id"
            @click="store.toggleTask(task.id)"
            class="flex justify-between items-center py-2 px-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition"
          >
            <span
              :class="task.done ? 'line-through text-gray-400' : 'text-gray-700'"
              class="text-[15px]"
            >
              {{ task.title }}
            </span>

            <span v-if="task.done" class="text-green-500 text-xl"> ✓ </span>
          </div>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-if="!Object.keys(groupedTasks).length" class="text-center py-12 text-gray-400">
      <div class="text-5xl mb-3">🌱</div>
      <p class="text-lg">Không có công việc nào hôm nay</p>
      <p class="text-sm">Chúc bạn ngày vui vẻ!</p>
    </div>
  </div>
</template>
