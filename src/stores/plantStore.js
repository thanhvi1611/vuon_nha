//plantStore.js
import { defineStore } from 'pinia'
import { db } from '@/db'
import dayjs from 'dayjs'
import { plantTemplates } from '@/data/plants'

export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [],
    tasks: [],
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
      const id = await db.plants.add(plant)

      const tasks = this.generateTasks(id, plant)

      if (tasks.length) {
        await db.tasks.bulkAdd(tasks)
      }

      await this.load()
      return id
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
        reminderTimes: t.reminderTimes || ['07:30', '17:03'], // Mặc định sáng + chiều
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
  },
})
