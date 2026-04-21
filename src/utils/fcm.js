// fcm.js
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const VAPID_KEY =
  'BPzOQo4IvYtRpXr37Mom8mr4tvP8SA4s-nMia5cL1rU6cKP8PrnH1Scsw69Mom_SmfbSg5tjp84YKdvt6183HiA'

export async function initFCM() {
  try {
    console.log('🔄 Bắt đầu initFCM trên mobile...')

    // 1. Xin quyền
    const permission = await Notification.requestPermission()
    console.log('📢 Permission:', permission)

    if (permission !== 'granted') {
      alert('Vui lòng cho phép thông báo trong cài đặt Chrome')
      return null
    }

    // 2. Đăng ký Service Worker với timeout
    let swRegistration = null
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        console.log('✅ Service Worker registered:', swRegistration.scope)
      } catch (err) {
        console.error('❌ Service Worker register failed:', err)
        alert('Lỗi Service Worker: ' + err.message)
        return null
      }
    }

    // 3. Lấy token với retry
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    })

    if (token) {
      console.log('🔥 FCM TOKEN thành công:', token)
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

async function saveTokenToCloud(token) {
  try {
    await setDoc(
      doc(db, 'users', 'me'),
      {
        fcmToken: token,
        platform: 'mobile',
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
    console.log('✅ Lưu token thành công')
  } catch (err) {
    console.error('Lỗi lưu token:', err)
  }
}
