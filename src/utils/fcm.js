// fcm.js
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const VAPID_KEY =
  'BI7NMI8Yj_rAfG-mTmqkTqKESIr-on9xBtr3_V27WHGD0PGMvDc7aUE76uaVPbAJRv7Den4ixNQIDAMW-xkowDY'

export async function initFCM() {
  try {
    console.log('🔄 Bắt đầu initFCM...')

    // 1. Xin quyền thông báo
    const permission = await Notification.requestPermission()
    console.log('📢 Permission:', permission)

    if (permission !== 'granted') {
      alert('Vui lòng cho phép thông báo cho website')
      return null
    }

    // 2. Đăng ký Service Worker và chờ nó active (RẤT QUAN TRỌNG)
    if (!('serviceWorker' in navigator)) {
      alert('Trình duyệt không hỗ trợ Service Worker')
      return null
    }

    console.log('📌 Đang đăng ký Service Worker...')
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

    // Chờ Service Worker active
    await navigator.serviceWorker.ready
    console.log('✅ Service Worker is ready and active')

    // 3. Lấy token
    console.log('📌 Đang lấy FCM Token...')
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    })

    if (token) {
      console.log('🔥 FCM TOKEN THÀNH CÔNG:', token)
      await saveTokenToCloud(token)
      alert('✅ Lấy FCM Token thành công!')
      return token
    } else {
      alert('⚠️ Không lấy được token')
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
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
    console.log('✅ Đã lưu token vào Firestore')
  } catch (err) {
    console.error('Lỗi lưu token:', err)
  }
}
