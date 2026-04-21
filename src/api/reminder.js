/* global process */
import admin from 'firebase-admin'

// 👉 init Firebase Admin (chỉ chạy 1 lần)
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
  const now = new Date()

  const today = now.toISOString().slice(0, 10)
  const currentTime = now.toTimeString().slice(0, 5)

  console.log(`⏰ RUN ${today} ${currentTime}`)

  const snapshot = await db.collection('tasks').where('date', '==', today).get()

  const promises = []

  snapshot.forEach((doc) => {
    const task = doc.data()
    const ref = doc.ref

    const times = task.reminderTimes || []
    const token = task.fcmToken

    if (!token) return
    if (!times.includes(currentTime)) return

    const key = `${today}_${currentTime.replace(':', '')}`

    if (task.notifiedMap && task.notifiedMap[key]) return

    const msg = {
      token,
      notification: {
        title: '🌱 Nhắc chăm cây',
        body: task.title,
      },
    }

    const p = admin
      .messaging()
      .send(msg)
      .then(() => {
        return ref.update({
          [`notifiedMap.${key}`]: true,
        })
      })

    promises.push(p)
  })

  await Promise.all(promises)

  res.json({ ok: true })
}
