import dayjs from 'dayjs'
import { db } from '@/db'

export function shouldNotify(now, reminderTime) {
  const current = dayjs(now).format('HH:mm')
  return current === reminderTime
}

export async function runDailyNotification() {
  const today = dayjs().format('YYYY-MM-DD')

  const tasks = await db.tasks.where('date').equals(today).toArray()

  for (const task of tasks) {
    if (task.done || task.notified) continue

    new Notification('🌱 Lịch làm vườn', {
      body: task.title,
    })

    await db.tasks.update(task.id, {
      notified: true,
    })
  }
}
