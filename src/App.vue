<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

import { onMounted, ref } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import { initFCM } from '@/utils/fcm'

const deferredPrompt = ref(null)
const showInstall = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🔥 beforeinstallprompt fired')

    e.preventDefault()

    deferredPrompt.value = e
    showInstall.value = true
  })

  // 👉 nếu đã cài thì ẩn
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showInstall.value = false
  }
})

async function installApp() {
  if (!deferredPrompt.value) {
    console.log('❌ Không có deferredPrompt')
    return
  }

  deferredPrompt.value.prompt()

  const { outcome } = await deferredPrompt.value.userChoice

  console.log('👉 User chọn:', outcome)

  if (outcome === 'accepted') {
    showInstall.value = false
  }

  deferredPrompt.value = null
}
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

onMounted(() => {
  setupFCM()
})
</script>

<template>
  <div class="min-h-dvh bg-[rgb(var(--color-bg))] text-gray-800">
    <!-- Header -->
    <AppHeader />

    <!-- Content -->
    <main class="px-4 pt-4 pb-24 space-y-4">
      <!-- BUTTON TEST -->

      <!-- STATUS -->
      <div class="text-sm space-y-1">
        <div v-if="loading">⏳ Đang lấy token11...</div>

        <div v-else-if="store.fcmToken" class="text-green-600">✅ Token OK: {{ shortToken }}</div>

        <div v-else class="text-red-500">❌ {{ error || 'Chưa có token' }}</div>
      </div>

      <!-- DEBUG INFO -->

      <router-view />
    </main>

    <!-- Bottom nav -->
    <BottomNav />
    <div
      v-if="showInstall"
      class="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 border flex items-center justify-between"
    >
      <div>
        <div class="font-semibold">🌱 Cài app Vườn Nhà</div>
        <div class="text-sm text-gray-500">Mở nhanh hơn & nhận thông báo tốt hơn</div>
      </div>

      <button @click="installApp" class="bg-green-500 text-white px-4 py-2 rounded-xl">Cài</button>
    </div>
    <div
      v-if="showUpdate"
      class="fixed top-4 left-4 right-4 bg-green-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between z-50"
    >
      <div>🌱 Có phiên bản mới</div>

      <button @click="updateApp" class="bg-white text-green-600 px-3 py-1 rounded-lg">
        Cập nhật
      </button>
    </div>
  </div>
</template>
