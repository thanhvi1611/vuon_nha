import dayjs from 'dayjs'
import { db } from '@/db'

export function startAutoNotification() {
  console.log('⏰ Auto notification started')

  const interval = setInterval(async () => {
    const now = dayjs()
    const today = now.format('YYYY-MM-DD')
    const currentTime = now.format('HH:mm')

    console.log('🕒 Check:', currentTime)

    const tasks = await db.tasks
      .where('date')
      .equals(today)
      .and((t) => !t.done)
      .toArray()

    for (const task of tasks) {
      const times = task.reminderTimes || []
      console.log(times)
      if (times.includes(currentTime)) {
        const key = `noti_${today}_${currentTime}`

        if (!task[key]) {
          console.log('🔔 Notify:', task.title)

          const reg = await navigator.serviceWorker.ready

          reg.showNotification(`🌱 ${task.title}`, {
            body: `Đến giờ: ${currentTime}`,
            icon: '/icons/plant-192.png',
          })

          await db.tasks.update(task.id, {
            [key]: true,
          })
        }
      }
    }
  }, 30000)

  return () => clearInterval(interval)
}
