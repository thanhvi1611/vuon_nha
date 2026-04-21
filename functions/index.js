const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

// ⏰ chạy mỗi phút
exports.scheduleNotify = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
  const now = new Date()

  const currentTime = now.toTimeString().slice(0, 5) // HH:mm
  const today = now.toISOString().slice(0, 10) // YYYY-MM-DD

  console.log('⏰ Checking:', today, currentTime)

  const db = admin.firestore()

  const snapshot = await db
    .collection('tasks')
    .where('date', '==', today)
    .where('done', '==', false)
    .get()

  for (const doc of snapshot.docs) {
    const task = doc.data()

    const times = task.reminderTimes || []

    if (!times.includes(currentTime)) continue

    if (task.notifiedTimes?.includes(currentTime)) continue

    const token = task.fcmToken
    if (!token) continue

    console.log('🔔 Sending:', task.title)

    await admin.messaging().send({
      token: token,
      notification: {
        title: `🌱 ${task.title}`,
        body: `Đến giờ: ${currentTime}`,
      },
    })

    await doc.ref.update({
      notifiedTimes: admin.firestore.FieldValue.arrayUnion(currentTime),
    })
  }

  return null
})
