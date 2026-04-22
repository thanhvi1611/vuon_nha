import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}

const db = admin.firestore()

export default async function handler(req, res) {
  try {
    const now = new Date()

    const today = now.toLocaleDateString('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
    })

    const currentTime = now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
    })
    console.log(`🚀 RUN ${today} ${currentTime}`)

    const snapshot = await db.collection('tasks').get()

    let sent = 0

    for (const doc of snapshot.docs) {
      const task = doc.data()

      if (!task.fcmToken) continue
      if (task.done) continue
      if (task.date !== today) continue

      const reminderTimes = task.reminderTimes || []

      if (!reminderTimes.includes(currentTime)) continue

      console.log(`📢 SEND → ${task.title}`)

      await admin.messaging().send({
        token: task.fcmToken,
        notification: {
          title: '🌱 Nhắc chăm cây',
          body: task.title,
        },
      })

      sent++
    }

    return res.json({
      ok: true,
      sent,
      time: currentTime,
    })
  } catch (err) {
    console.error('🔥 ERROR:', err)

    return res.status(500).json({
      ok: false,
      error: err.message,
    })
  }
}
