// src/main.js
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { registerSW } from 'virtual:pwa-register'
import { useAuthStore } from '@/stores/authStore'

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
   4. START APP (AUTH FIRST)
========================= */
async function start() {
  const authStore = useAuthStore()

  // 🔥 init auth NGAY từ đầu
  authStore.init()

  // 🔥 đợi Firebase trả user
  await authStore.ready

  console.log('👤 Firebase ready:', authStore.user?.uid)

  // 👉 sau khi có user mới mount app
  app.use(router)
  app.mount('#app')
}

start()