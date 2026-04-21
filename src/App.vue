<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

import { onMounted, ref } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import { initFCM } from '@/utils/fcm'

const store = usePlantStore()

const loading = ref(false)
const error = ref('')
const shortToken = ref('')

// 👉 init 1 lần duy nhất
async function setupFCM() {
  loading.value = true
  error.value = ''

  try {
    const token = await initFCM()

    if (token) {
      store.fcmToken = token
      shortToken.value = token.slice(0, 30) + '...'

      console.log('✅ TOKEN OK:', token)
    } else {
      error.value = 'Không lấy được token (token null)'
      console.warn('❌ Token null')
    }
  } catch (err) {
    console.error('❌ Lỗi init FCM:', err)
    error.value = err.message || 'Lỗi không xác định'
  }

  loading.value = false
}

// 👉 nút test (KHÔNG gọi initFCM lại)
function testFCM() {
  if (store.fcmToken) {
    alert('✅ Token OK:\n' + store.fcmToken.slice(0, 40) + '...')
  } else {
    alert('❌ Chưa có token')
  }
}

onMounted(() => {
  setupFCM()
})
async function testAPI() {
  const res = await fetch('/api/reminder')
  const data = await res.json()
  console.log('API result:', data)
}
</script>

<template>
  <div class="min-h-dvh bg-[rgb(var(--color-bg))] text-gray-800">
    <!-- Header -->
    <AppHeader />

    <!-- Content -->
    <main class="px-4 pt-4 pb-24 space-y-4">
      <!-- BUTTON TEST -->
      <button @click="testAPI" class="bg-red-500 text-white p-4 rounded-xl w-full active:scale-95">
        Test API trên Mobile
      </button>

      <!-- STATUS -->
      <div class="text-sm space-y-1">
        <div v-if="loading">⏳ Đang lấy token...</div>

        <div v-else-if="store.fcmToken" class="text-green-600">✅ Token OK: {{ shortToken }}</div>

        <div v-else class="text-red-500">❌ {{ error || 'Chưa có token' }}</div>
      </div>

      <!-- DEBUG INFO -->

      <router-view />
    </main>

    <!-- Bottom nav -->
    <BottomNav />
  </div>
</template>
