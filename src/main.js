import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { db } from '@/db'
import { shouldNotify } from '@/utils/notification'
import dayjs from 'dayjs'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

setInterval(async () => {
  const setting = await db.settings.get('reminder')
  if (!setting) return

  const now = new Date()

  if (shouldNotify(now, setting.time)) {
    const tasks = await db.tasks.toArray()
    const today = dayjs().format('YYYY-MM-DD')

    const todayTasks = tasks.filter((t) => t.date === today && !t.done)

    todayTasks.forEach((t) => {
      new Notification('🌱 Lịch làm vườn', {
        body: t.title,
      })
    })
  }
}, 60000) // check mỗi phút
