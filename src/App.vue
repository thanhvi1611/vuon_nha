<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import LoginBanner from '@/components/LoginBanner.vue'

import { ref, onMounted, onUnmounted } from 'vue'
import { usePlantStore } from '@/stores/plantStore'

import { initFCM } from '@/utils/fcm'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '@/firebase'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.init()
  console.log('USER:', authStore.user)
console.log('LOADING:', authStore.loading)
})
/* =======================
   STATE
======================= */
const store = usePlantStore()

const loading = ref(false)
const error = ref('')
const shortToken = ref('')

const showInstall = ref(false)
const deferredPrompt = ref(null)

let installHandler = null

const ONE_DAY = 24 * 60 * 60 * 1000

/* =======================
   INIT APP
======================= */
onMounted(async () => {
  await ensureLogin()
  await setupFCM()
  initInstallPrompt()
})

onUnmounted(() => {
  if (installHandler) {
    window.removeEventListener('beforeinstallprompt', installHandler)
  }
})

/* =======================
   AUTH
======================= */
async function ensureLogin() {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
    console.log('👤 Anonymous login:', auth.currentUser.uid)
  }
}

/* =======================
   FCM
======================= */
async function setupFCM() {
  loading.value = true
  error.value = ''

  try {
    const token = await initFCM()

    if (token) {
      store.fcmToken = token
      shortToken.value = token.slice(0, 30) + '...'

      console.log('✅ FCM TOKEN:', token)
    } else {
      error.value = 'Không lấy được token'
    }
  } catch (err) {
    console.error('❌ FCM error:', err)
    error.value = err.message || 'FCM error'
  }

  loading.value = false
}

/* =======================
   PWA INSTALL
======================= */
function initInstallPrompt() {
  // nếu đã cài app → không hiện
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return
  }

  // check thời gian ẩn
  const hideUntil = localStorage.getItem('hide-install-until')
  const now = Date.now()

  if (hideUntil && now < Number(hideUntil)) return

  installHandler = (e) => {
    e.preventDefault()

    deferredPrompt.value = e

    // delay 1 chút cho UX
    setTimeout(() => {
      showInstall.value = true
    }, 1500)
  }

  window.addEventListener('beforeinstallprompt', installHandler)
}

/* 👉 user bấm cài */
async function installApp() {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()
  const result = await deferredPrompt.value.userChoice

  if (result.outcome === 'accepted') {
    console.log('✅ User installed app')
  }

  deferredPrompt.value = null
  showInstall.value = false
}

/* 👉 đóng và ẩn 1 ngày */
function closeInstall() {
  showInstall.value = false

  const until = Date.now() + ONE_DAY
  localStorage.setItem('hide-install-until', until)
}
</script>

<template>
  <div class="min-h-dvh bg-[rgb(var(--color-bg))] text-gray-800">
    <!-- LOGIN BANNER -->
    <LoginBanner />

    <!-- HEADER -->
    <AppHeader />

    <!-- CONTENT -->
    <main class="px-4 pt-4 pb-24 space-y-4">
      <!-- FCM STATUS -->
      <div class="text-sm space-y-1">
        <div v-if="loading">⏳ Đang lấy token...</div>

        <div v-else-if="store.fcmToken" class="text-green-600">
          ✅ Token OK: {{ shortToken }}
        </div>

        <div v-else class="text-red-500">
          ❌ {{ error || 'Chưa có token' }}
        </div>
      </div>

      <router-view />
    </main>

    <!-- BOTTOM NAV -->
    <BottomNav />

    <!-- INSTALL POPUP -->
    <div
      v-if="showInstall"
      class="fixed bottom-5 left-4 right-4 z-50 transition-all duration-300"
      :class="showInstall ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
    >
      <div
        class="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-4 flex items-center justify-between"
      >
        <!-- LEFT -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
            🌱
          </div>

          <div>
            <div class="font-semibold text-gray-800">Cài app Vườn Nhà</div>
            <div class="text-xs text-gray-500">
              Truy cập nhanh • Nhận thông báo • Mượt hơn
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-2">
          <button
            @click="installApp"
            class="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow-md active:scale-95 transition"
          >
            Cài đặt
          </button>

          <button
            @click="closeInstall"
            class="px-2 py-2 text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>