// fcm.js
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/firebase'
import { db } from '@/firebase' // Firestore instance
import { doc, setDoc } from 'firebase/firestore' // ← Thêm import này

const VAPID_KEY =
  'BPzOQo4IvYtRpXr37Mom8mr4tvP8SA4s-nMia5cL1rU6cKP8PrnH1Scsw69Mom_SmfbSg5tjp84YKdvt6183HiA'

// ==================== SỬA Ở ĐÂY ====================
export async function initFCM() {
  try {
    console.log('🔄 Đang init FCM...')

    const permission = await Notification.requestPermission()
    console.log('📢 Permission:', permission)

    if (permission !== 'granted') {
      alert('Vui lòng cho phép thông báo')
      return null
    }

    // Đăng ký Service Worker
    let swRegistration = null
    if ('serviceWorker' in navigator) {
      swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      console.log('✅ Service Worker registered')
    }

    // Lấy token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    })

    if (token) {
      console.log('🔥 FCM TOKEN:', token)
      await saveTokenToCloud(token)
      return token
    } else {
      console.warn('⚠️ Không lấy được token')
      return null
    }
  } catch (error) {
    console.error('❌ Lỗi initFCM:', error)
    alert('Lỗi FCM: ' + error.message)
    return null
  }
}

// ==================== HÀM LƯU TOKEN (ĐÃ SỬA) ====================
async function saveTokenToCloud(token) {
  try {
    const userRef = doc(db, 'users', 'me') // ← Dùng cú pháp mới

    await setDoc(
      userRef,
      {
        fcmToken: token,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    console.log('✅ Đã lưu FCM Token vào Firestore')
  } catch (err) {
    console.error('❌ Lỗi lưu token vào Firestore:', err)
  }
}

// Nhận thông báo foreground
export function listenFCM() {
  onMessage(messaging, (payload) => {
    console.log('📩 Foreground message:', payload)
    new Notification(payload.notification?.title || '🌱 Lịch làm vườn', {
      body: payload.notification?.body || 'Bạn có công việc cần làm',
      icon: '/icons/plant-192.png',
    })
  })
}
