import { defineStore } from 'pinia'
import { db } from '@/db'
import dayjs from 'dayjs'

export const usePlantStore = defineStore('plant', {
  state: () => ({
    plants: [],
    tasks: [],
  }),

  actions: {
    async load() {
      this.plants = await db.plants.toArray()
      this.tasks = await db.tasks.toArray()
    },

    async addPlant(plant) {
      const id = await db.plants.add(plant)

      // generate task tự động
      const tasks = this.generateTasks(id, plant)

      await db.tasks.bulkAdd(tasks)

      await this.load()
    },

    generateTasks(plantId, plant) {
      const baseTasks = [
        { day: 0, title: 'Gieo hạt' },
        { day: 3, title: 'Tưới nước' },
        { day: 10, title: 'Bón phân' },
        { day: 20, title: 'Làm giàn' },
        { day: 30, title: 'Ra hoa' },
        { day: 45, title: 'Thu hoạch' },
      ]

      return baseTasks.map((t) => ({
        plantId,
        title: t.title,
        done: false,
        date: dayjs(plant.startDate).add(t.day, 'day').format('YYYY-MM-DD'),
      }))
    },
  },
})
