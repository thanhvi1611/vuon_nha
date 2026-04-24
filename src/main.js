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
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })
import { ref } from 'vue'

const deferredPrompt = ref(null)
const showInstall = ref(false)

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()

  deferredPrompt.value = e
  showInstall.value = true

  console.log('✅ Có thể cài app')
})
async function installApp() {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()

  const { outcome } = await deferredPrompt.value.userChoice

  console.log('👉 User chọn:', outcome)

  if (outcome === 'accepted') {
    showInstall.value = false
  }

  deferredPrompt.value = null
}
