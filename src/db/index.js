import Dexie from 'dexie'

export const db = new Dexie('gardenDB')

db.version(1).stores({
  tasks: '++id, plantId, date, title, done',
  plants: '++id, name, type, startDate, image',
})
