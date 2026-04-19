import Dexie from 'dexie'

export const db = new Dexie('gardenDB')

/**
 * VERSION 1 (initial)
 */
db.version(1).stores({
  plants: '++id, name, type, startDate',
  tasks: '++id, plantId, date, title, done',
})

/**
 * VERSION 2 (add image + settings + notified)
 */
db.version(2).stores({
  plants: '++id, name, type, startDate, image',
  tasks: '++id, plantId, date, title, done, notified',
  settings: 'id, time',
})

/**
 * VERSION 3 (hỗ trợ nhắc nhiều lần theo giờ)
 */
db.version(3).stores({
  plants: '++id, name, type, startDate, image',
  tasks: '++id, plantId, date, title, done, notified, reminderTimes',
  settings: 'id, time',
})

/**
 * MIGRATION v2 → v3
 */
db.version(3).upgrade(async (tx) => {
  console.log('🚀 Migrating DB v2 → v3 (thêm reminderTimes)')

  const tasks = await tx.table('tasks').toArray()

  for (const t of tasks) {
    await tx.table('tasks').update(t.id, {
      reminderTimes: t.reminderTimes || ['16:00'], // mặc định nhắc lúc 7h sáng nếu chưa có
      // giữ nguyên notified cũ (nếu cần)
    })
  }

  console.log(`✅ Đã migrate ${tasks.length} tasks`)
})

/**
 * MIGRATION v1 → v2 (giữ nguyên code cũ của bạn)
 */
db.version(2).upgrade(async (tx) => {
  console.log('🚀 Migrating DB v1 → v2')

  await tx.table('settings').put({
    id: 'reminder',
    time: '07:00',
  })

  const plants = await tx.table('plants').toArray()
  for (const p of plants) {
    await tx.table('plants').update(p.id, { image: p.image || '' })
  }

  const tasks = await tx.table('tasks').toArray()
  for (const t of tasks) {
    await tx.table('tasks').update(t.id, { notified: false })
  }
})

/**
 * DEBUG
 */
db.on('ready', () => {
  console.log('✅ Garden DB is ready - Version', db.verno)
})
