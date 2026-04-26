//plantStore.js
import { defineStore } from 'pinia'
import { db } from '@/db'
import dayjs from 'dayjs'
import { plantTemplates } from '@/data/plants'
import { collection, addDoc } from 'firebase/firestore'
import { db as cloudDb } from '@/firebase'
import { auth } from '@/firebase'



function getUserId() {
  return auth.currentUser?.uid
}
export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [],
    tasks: [],
    fcmToken: '',
  }),

  getters: {
    todayTasks(state) {
      const today = dayjs().format('YYYY-MM-DD')
      return state.tasks.filter((t) => t.date === today && !t.done)
    },
  },

  actions: {
    async load() {
      this.plants = await db.plants.toArray()
      this.tasks = await db.tasks.toArray()
    },

    // ➕ Thêm cây mới + tạo task
   async addPlant(plant) {
  const userId = getUserId()
  if (!userId) {
    console.warn('❌ Chưa login')
    return
  }

  // 👉 lưu local trước (nhanh)
  const plantId = await db.plants.add(plant)

  // 👉 tạo task
  const tasks = this.generateTasks(plantId, plant)

  // 👉 lưu LOCAL
  await db.tasks.bulkAdd(tasks)

  // 👉 lưu CLOUD (plant)
  const plantRef = await addDoc(
    collection(cloudDb, 'users', userId, 'plants'),
    {
      ...plant,
      createdAt: new Date(),
    }
  )

  console.log('☁️ Plant saved:', plantRef.id)

  // 👉 lưu CLOUD (tasks)
  for (const t of tasks) {
    const payload = {
      ...t,
      fcmToken: this.fcmToken,
      plantName: plant.name,
      userId,
      createdAt: new Date(),
    }

    await addDoc(collection(cloudDb, 'users', userId, 'tasks'), payload)

    console.log('🔥 Task saved:', payload)
  }

  await this.load()
},

    async deletePlant(id) {
      await db.plants.delete(id)
      await db.tasks.where('plantId').equals(id).delete()
      await this.load()
    },

    async toggleTask(id) {
      const task = await db.tasks.get(id)
      if (!task) return

      await db.tasks.update(id, { done: !task.done })
      await this.load()
    },

    // ⚙️ TẠO TASK TỰ ĐỘNG - ĐÃ SỬA
    generateTasks(plantId, plant) {
      const template = plantTemplates.find((t) => t.id === plant.type)
      if (!template || !template.tasks) return []

      return template.tasks.map((t) => ({
        plantId,
        title: t.title,
        done: false,
        notified: false,
        date: dayjs(plant.startDate).add(t.day, 'day').format('YYYY-MM-DD'),

        // ==================== THÊM PHẦN NÀY ====================
        reminderTimes: t.reminderTimes || ['06:30', '16:00'], // Mặc định sáng + chiều
      }))
    },

    async updatePlant(id, data) {
      await db.plants.update(id, data)
      await this.load()
    },

    getProgress(plant) {
      const template = plantTemplates.find((t) => t.id === plant.type)
      if (!template) return 0

      const total = template.duration
      const passed = dayjs().diff(dayjs(plant.startDate), 'day')
      return Math.min(100, Math.round((passed / total) * 100))
    },

    getStage(plant) {
      const template = plantTemplates.find((t) => t.id === plant.type)
      if (!template) return null

      const day = dayjs().diff(dayjs(plant.startDate), 'day')
      return template.stages.find((s) => day >= s.dayStart && day <= s.dayEnd)
    },
    async syncToCloud() {
  const userId = auth.currentUser?.uid
  if (!userId) return

  console.log('☁️ Sync lên cloud...')

  // 👉 sync plants
  for (const plant of this.plants) {
    await addDoc(collection(cloudDb, 'users', userId, 'plants'), {
      ...plant,
      createdAt: new Date(),
    })
  }

  // 👉 sync tasks
  for (const task of this.tasks) {
    await addDoc(collection(cloudDb, 'users', userId, 'tasks'), {
      ...task,
      createdAt: new Date(),
    })
  }

  console.log('✅ Sync xong')
}
  },
  
})

