<script setup>
import dayjs from 'dayjs'
import { computed } from 'vue'
import { usePlantStore } from '@/stores/plantStore'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const todayStr = dayjs().format('YYYY-MM-DD')

// 👉 tổng task hôm nay
const allToday = computed(() => store.tasks.filter((t) => t.date === todayStr))

// 👉 chưa làm
const todayTasks = computed(() => allToday.value.filter((t) => !t.done))

// 👉 đã làm
const doneToday = computed(() => allToday.value.filter((t) => t.done))

// 👉 progress %
const progress = computed(() => {
  if (!allToday.value.length) return 100
  return Math.round((doneToday.value.length / allToday.value.length) * 100)
})

// 👉 màu theo mức độ bận
const taskColor = computed(() => {
  if (todayTasks.value.length === 0) return 'text-green-600 bg-green-100'
  if (todayTasks.value.length <= 2) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
})
const store = usePlantStore()

// 👉 số cây
const totalPlants = computed(() => store.plants.length)

// 👉 task hôm nay (chưa làm)

const today = dayjs().format('DD/MM')


</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
    <div class="px-4 pt-4 pb-3 space-y-3">
      <!-- Top row -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">🌱 Vườn Nhà</h1>
          <p class="text-sm text-gray-500">Hôm nay {{ today }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition"
          >
            🔍
          </button>

          <button
            class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition"
          >
            ⚙️
          </button>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="space-y-2">
        <!-- Stats -->
        <div class="flex gap-2">
          <!-- 🌱 CÂY -->
          <div
            class="flex-1 rounded-xl px-3 py-2 text-sm bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
          >
            🌿 <b>{{ totalPlants }}</b> cây
          </div>

          <!-- 📋 TASK -->
          <div class="flex-1 rounded-xl px-3 py-2 text-sm" :class="taskColor">
            ⏰ <b>{{ todayTasks.length }}</b>
            <span v-if="todayTasks.length"> việc</span>
            <span v-else> rảnh 🎉</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            class="h-full transition-all duration-500"
            :style="{
              width: progress + '%',
              background: progress === 100 ? '#22c55e' : '#3b82f6',
            }"
          />
        </div>

        <!-- Text progress -->
        <div class="text-xs text-gray-500 text-right">
          {{ doneToday.length }}/{{ allToday.length }} hoàn thành
        </div>
      </div>
      <div class="flex items-center gap-3">
    <!-- user info -->
    <div v-if="!authStore.user?.isAnonymous" class="text-sm">
      👤 {{ authStore.user.displayName || 'User' }}
    </div>

    <!-- logout button -->
    <button
      v-if="!authStore.user?.isAnonymous"
      @click="authStore.logout"
      class="text-xs bg-gray-200 px-3 py-1 rounded-lg"
    >
      Đăng xuất
    </button>
  </div>
    </div>

  </header>
</template>
