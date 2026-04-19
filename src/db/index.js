import Dexie from 'dexie'

export const db = new Dexie('gardenDB')

db.version(1).stores({
  plants: '++id, name, startDate, type',
  tasks: '++id, plantId, date, title, done',
})
