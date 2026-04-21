// firebase.js hoặc file initFCM
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/firebase'
import { db } from '@/firebase' // firestore

const VAPID_KEY =
  'BPzOQo4IvYtRpXr37Mom8mr4tvP8SA4s-nMia5cL1rU6cKP8PrnH1Scsw69Mom_SmfbSg5tjp84YKdvt6183HiA'

export async function initFCM() {
  try {
    console.log('🔄 Bắt đầu initFCM...')

    // 1. Xin quyền
    const permission = await Notification.requestPermission()
    console.log('📢 Notification permission:', permission)

    if (permission !== 'granted') {
      alert('Vui lòng cho phép thông báo trong cài đặt Chrome')
      return null
    }

    // 2. Đăng ký Service Worker (rất quan trọng trên mobile)
    let swRegistration = null
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        })
        console.log('✅ Service Worker registered successfully')
      } catch (err) {
        console.error('❌ Service Worker register failed:', err)
      }
    }

    // 3. Lấy token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    })

    if (token) {
      console.log('🔥 FCM TOKEN (Mobile):', token)
      // Lưu token
      await saveTokenToCloud(token)
      return token
    } else {
      console.warn('⚠️ getToken trả về null')
      return null
    }
  } catch (error) {
    console.error('❌ Lỗi initFCM:', error)
    alert('Lỗi FCM: ' + error.message)
    return null
  }
}

export async function saveTokenToCloud() {
  const token = await getToken(messaging, {
    vapidKey:
      'BBjnTEpCnacbTbMLCY61vqDhHY7mFUtwtsA6vL4OrFD-MlhqPa3hkdugrHwxcGHzr3YFKOvpctK0S6t3v09ZoCM',
  })

  await db.collection('users').doc('me').set({
    fcmToken: token,
  })

  return token
}
