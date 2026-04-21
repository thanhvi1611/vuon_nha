// fcm.js
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const VAPID_KEY =
  'BPzOQo4IvYtRpXr37Mom8mr4tvP8SA4s-nMia5cL1rU6cKP8PrnH1Scsw69Mom_SmfbSg5tjp84YKdvt6183HiA'

export async function initFCM() {
  try {
    console.log('🔄 [FCM] Bắt đầu init trên mobile...')

    // 1. Xin quyền
    const permission = await Notification.requestPermission()
    console.log('📢 Permission:', permission)

    if (permission !== 'granted') {
      alert('Bạn phải cho phép thông báo trước')
      return null
    }

    // 2. Đăng ký Service Worker
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    console.log('✅ SW Registered, scope:', swRegistration.scope)

    // 3. Chờ Service Worker active
    await navigator.serviceWorker.ready
    console.log('✅ Service Worker is READY')

    // 4. Lấy token với delay nhỏ (rất quan trọng trên mobile)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    })

    console.log('🔥 FCM TOKEN:', token)
    await saveTokenToCloud(token)
    alert('✅ Lấy token thành công!')

    return token
  } catch (error) {
    console.error('❌ Lỗi FCM chi tiết:', error)
    alert('Lỗi FCM: ' + error.message)
    return null
  }
}

async function saveTokenToCloud(token) {
  await setDoc(
    doc(db, 'users', 'me'),
    {
      fcmToken: token,
      updatedAt: new Date().toISOString(),
      platform: 'android',
    },
    { merge: true },
  )
}
