import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

admin.initializeApp()

const db = admin.firestore()

// ⏰ chạy mỗi phút
export const sendPlantReminders = functions.pubsub
  .schedule('* * * * *')
  .timeZone('Asia/Ho_Chi_Minh')
  .onRun(async () => {
    const now = new Date()

    const today = now.toISOString().slice(0, 10)
    const currentTime = now.toTimeString().slice(0, 5) // HH:mm

    console.log(`\n⏰ RUN at ${currentTime} | ${today}`)

    try {
      const snapshot = await db.collection('tasks').where('date', '==', today).get()

      console.log(`📋 Found ${snapshot.size} tasks today`)

      const promises = []

      snapshot.forEach((doc) => {
        const task = doc.data()
        const docRef = doc.ref

        const reminderTimes = task.reminderTimes || []
        const token = task.fcmToken

        console.log(`\n🌱 Task: ${task.title}`)
        console.log(`⏰ ReminderTimes:`, reminderTimes)

        if (!token) {
          console.log('⚠️ No token → skip')
          return
        }

        if (!reminderTimes.includes(currentTime)) {
          return
        }

        const key = `${today}_${currentTime.replace(':', '')}`

        if (task.notifiedMap && task.notifiedMap[key]) {
          console.log('⚠️ Already sent → skip')
          return
        }

        console.log('🚀 Sending notification...')

        const message = {
          token,
          notification: {
            title: '🌱 Nhắc chăm cây',
            body: task.title,
          },
          android: {
            priority: 'high',
          },
        }

        const sendPromise = admin
          .messaging()
          .send(message)
          .then(async (res) => {
            console.log('✅ Sent:', res)

            await docRef.update({
              [`notifiedMap.${key}`]: true,
            })
          })
          .catch((err) => {
            console.error('❌ Send error:', err)
          })

        promises.push(sendPromise)
      })

      await Promise.all(promises)

      console.log('🎉 DONE cycle')
    } catch (err) {
      console.error('🔥 ERROR:', err)
    }

    return null
  })
