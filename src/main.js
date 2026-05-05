import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { registerSW } from 'virtual:pwa-register'

import { useAuthStore } from '@/stores/authStore'
import { getRedirectResult } from 'firebase/auth'
import { auth } from '@/firebase'

/* =========================
   1. CREATE APP
========================= */
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

/* =========================
   2. GLOBAL STATE (PWA)
========================= */
window.__APP__ = {
  showUpdate: false,
  updateSW: null,
}

/* =========================
   3. REGISTER SERVICE WORKER
========================= */
const updateSW = registerSW({
  immediate: true,

  onNeedRefresh() {
    console.log('🔄 Có bản mới')
    window.__APP__.showUpdate = true
  },

  onOfflineReady() {
    console.log('📦 App sẵn sàng offline')
  },
})

window.__APP__.updateSW = updateSW

/* =========================
   4. HANDLE REDIRECT LOGIN
========================= */
async function handleRedirect() {
  console.log('🚀 [AUTH] Start handleRedirect')
  console.log('👉 Current URL:', window.location.href)

  try {
    const result = await getRedirectResult(auth)
    console.log('👉 Redirect raw result:', result)

    if (result?.user) {
      console.log('✅ Đăng nhập thành công qua Redirect!', result.user.uid)
      // Có thể lưu thêm credential nếu cần
    } else {
      console.warn('⚠️ No redirect result (NULL) - Có thể là load bình thường')
    }
  } catch (err) {
    console.error('❌ Redirect ERROR:', err.code, err.message)
    // Các error hay gặp: auth/redirect-result-missing, auth/argument-error...
  }

  console.log('🧭 [AUTH] End handleRedirect')
}
/* =========================
   5. START APP
========================= */
async function start() {
  const authStore = useAuthStore()

  // 🔥 1. xử lý redirect TRƯỚC
  await handleRedirect()

  // 🔥 2. init auth listener
  authStore.init()

  // 🔥 3. đợi Firebase trả user
  await authStore.ready

  console.log('👤 Firebase ready:', authStore.user?.uid || 'none')

  // 🔥 4. mount app
  app.use(router)
  app.mount('#app')
}

start()