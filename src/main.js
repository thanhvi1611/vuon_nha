import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { db } from '@/db'
import dayjs from 'dayjs'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('✅ SW registered')
  })
}
const showNotification = async (title, body) => {
  const reg = await navigator.serviceWorker.getRegistration()

  if (reg) {
    reg.showNotification(`🌱 ${title}`, {
      body,
      icon: '/icon.png',
    })
  }
}
