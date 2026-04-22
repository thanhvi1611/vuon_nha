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
    const grouped = {}

    for (const doc of snapshot.docs) {
      const task = doc.data()

      if (!task.fcmToken || task.done || task.date !== today) continue
      if (!task.reminderTimes?.includes(currentTime)) continue

      const key = task.fcmToken

      if (!grouped[key]) grouped[key] = []

      grouped[key].push(task)
    }
    for (const token in grouped) {
      const tasks = grouped[token]

      const body = tasks.map((t) => `• ${t.plantName}: ${t.title}`).join('\n')

      await admin.messaging().send({
        token,
        data: {
          title: '🌱 Việc cần làm hôm nay',
          body,
          url: 'https://vuon-nha-zhsd.vercel.app/calendar',
        },
      })
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
