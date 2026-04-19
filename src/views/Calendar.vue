<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import dayjs from 'dayjs'

const store = usePlantStore()

const today = dayjs()
const currentMonth = ref(today)
const selectedDate = ref(today.format('YYYY-MM-DD'))

onMounted(async () => {
  await store.load()
  requestNotification()
  checkTodayTasks()
})

// 🔔 xin quyền notification
async function requestNotification() {
  if ('Notification' in window) {
    await Notification.requestPermission()
  }
}

// 🔔 gửi notification
function notify(title) {
  if (Notification.permission === 'granted') {
    new Notification('🌱 Lịch làm vườn', {
      body: title,
    })
  }
}

// 📌 Map cây
const plantMap = computed(() => {
  const map = {}
  store.plants.forEach((p) => {
    map[p.id] = p
  })
  return map
})

// 📌 tasks theo ngày
const tasksByDate = computed(() => {
  return store.tasks.filter((t) => t.date === selectedDate.value)
})

// 🌱 nhóm task theo cây
const groupedTasks = computed(() => {
  const groups = {}

  tasksByDate.value.forEach((task) => {
    const plantId = task.plantId
    if (!groups[plantId]) {
      groups[plantId] = []
    }
    groups[plantId].push(task)
  })

  return groups
})

// 🔔 check task hôm nay
function checkTodayTasks() {
  const todayStr = today.format('YYYY-MM-DD')

  const todayTasks = store.tasks.filter((t) => t.date === todayStr && !t.done)

  todayTasks.forEach((t) => {
    const plant = plantMap.value[t.plantId]
    notify(`${t.title} - ${plant?.name}`)
  })
}

// 📅 grid tháng
const days = computed(() => {
  const start = currentMonth.value.startOf('month')
  const end = currentMonth.value.endOf('month')

  const arr = []
  const startDay = start.day()

  for (let i = 0; i < startDay; i++) arr.push(null)

  for (let d = 1; d <= end.date(); d++) {
    arr.push(start.date(d))
  }

  return arr
})

// 📌 có task không
function hasTask(date) {
  const d = date.format('YYYY-MM-DD')
  return store.tasks.some((t) => t.date === d)
}

// 📌 đổi tháng
function nextMonth() {
  currentMonth.value = currentMonth.value.add(1, 'month')
}
function prevMonth() {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}
</script>

<template>
  <div class="space-y-5">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <button @click="prevMonth">‹</button>
      <h2 class="font-semibold text-lg">
        {{ currentMonth.format('MM/YYYY') }}
      </h2>
      <button @click="nextMonth">›</button>
    </div>

    <!-- WEEK -->
    <div class="grid grid-cols-7 text-center text-sm text-gray-400">
      <div>CN</div>
      <div>T2</div>
      <div>T3</div>
      <div>T4</div>
      <div>T5</div>
      <div>T6</div>
      <div>T7</div>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="(day, i) in days"
        :key="i"
        class="h-12 flex flex-col items-center justify-center rounded-xl cursor-pointer"
        :class="[
          day ? 'bg-white' : '',
          day && day.format('YYYY-MM-DD') === selectedDate ? 'ring-2 ring-green-400' : '',
          day && day.isSame(today, 'day') ? 'bg-green-50' : '',
        ]"
        @click="day && (selectedDate = day.format('YYYY-MM-DD'))"
      >
        <span v-if="day">{{ day.date() }}</span>

        <span v-if="day && hasTask(day)" class="w-1.5 h-1.5 bg-green-500 rounded-full mt-1" />
      </div>
    </div>

    <!-- TASK GROUP -->
    <div class="space-y-4">
      <div
        v-for="(tasks, plantId) in groupedTasks"
        :key="plantId"
        class="bg-white p-4 rounded-2xl shadow-sm"
      >
        <!-- tên cây -->
        <h3 class="font-semibold text-green-600 mb-2">🌱 {{ plantMap[plantId]?.name }}</h3>

        <!-- task list -->
        <div class="space-y-2">
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

    <!-- EMPTY -->
    <div v-if="!Object.keys(groupedTasks).length" class="text-center text-gray-400">
      Không có việc 🎉
    </div>
  </div>
</template>
