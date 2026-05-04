<script setup>
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

import { usePlantStore } from '@/stores/plantStore'
import { useAuthStore } from '@/stores/authStore'

const store = usePlantStore()
const authStore = useAuthStore()

/* =========================
   DATE
========================= */
const todayStr = dayjs().format('YYYY-MM-DD')
const today = dayjs().format('DD/MM')

/* =========================
   TASKS
========================= */
const allToday = computed(() =>
  store.tasks.filter((t) => t.date === todayStr)
)

const todayTasks = computed(() =>
  allToday.value.filter((t) => !t.done)
)

const doneToday = computed(() =>
  allToday.value.filter((t) => t.done)
)

const progress = computed(() => {
  if (!allToday.value.length) return 100
  return Math.round(
    (doneToday.value.length / allToday.value.length) * 100
  )
})

const taskColor = computed(() => {
  if (todayTasks.value.length === 0)
    return 'text-green-600 bg-green-100'
  if (todayTasks.value.length <= 2)
    return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
})

const totalPlants = computed(() => store.plants.length)

/* =========================
   AUTH
========================= */
const isLoggedIn = computed(() => {
  return authStore.user && !authStore.user.isAnonymous
})

const isGuest = computed(() => {
  return authStore.user?.isAnonymous
})

const displayName = computed(() => {
  return authStore.user?.displayName || 'Người dùng'
})

const avatar = computed(() => {
  return (
    authStore.user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}`
  )
})

/* =========================
   UI STATE
========================= */
const showMenu = ref(false)

function toggleMenu() {
  showMenu.value = !showMenu.value
}

async function logout() {
  await authStore.logout()
  showMenu.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
    <div class="px-4 pt-4 pb-3 space-y-3">
      <!-- TOP -->
      <div class="flex items-center justify-between">
        <!-- LEFT -->
        <div>
          <h1 class="text-xl font-bold">🌱 Vườn Nhà</h1>
          <p class="text-sm text-gray-500">
            Hôm nay {{ today }}
          </p>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-2">
          <!-- search -->
          <button
            class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95"
          >
            🔍
          </button>

          <!-- avatar -->
          <div class="relative">
            <img
              :src="avatar"
              @click="toggleMenu"
              class="w-9 h-9 rounded-full object-cover cursor-pointer border"
            />

            <!-- dropdown -->
            <div
              v-if="showMenu"
              class="absolute right-0 mt-2 w-48 bg-white border rounded-2xl shadow-xl p-2 text-sm"
            >
              <!-- user info -->
              <div class="px-3 py-2 border-b">
                <div class="font-medium">
                  {{ displayName }}
                </div>

                <div class="text-xs text-gray-500">
                  <span v-if="isGuest">Chế độ khách</span>
                  <span v-else>
                    {{ authStore.user?.email }}
                  </span>
                </div>
              </div>

              <!-- actions -->
              <button
                v-if="isLoggedIn"
                @click="logout"
                class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-xl"
              >
                🚪 Đăng xuất
              </button>

              <div
                v-else
                class="px-3 py-2 text-gray-400 text-xs"
              >
                Đăng nhập để đồng bộ dữ liệu
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STATS -->
      <div class="space-y-2">
        <div class="flex gap-2">
          <!-- plants -->
          <div
            class="flex-1 rounded-xl px-3 py-2 text-sm bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]"
          >
            🌿 <b>{{ totalPlants }}</b> cây
          </div>

          <!-- tasks -->
          <div
            class="flex-1 rounded-xl px-3 py-2 text-sm"
            :class="taskColor"
          >
            ⏰ <b>{{ todayTasks.length }}</b>
            <span v-if="todayTasks.length"> việc</span>
            <span v-else> rảnh 🎉</span>
          </div>
        </div>

        <!-- progress -->
        <div class="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            class="h-full transition-all duration-500"
            :style="{
              width: progress + '%',
              background:
                progress === 100 ? '#22c55e' : '#3b82f6',
            }"
          />
        </div>

        <div class="text-xs text-gray-500 text-right">
          {{ doneToday.length }}/{{ allToday.length }} hoàn thành
        </div>
      </div>
    </div>
  </header>
</template>