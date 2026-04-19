import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/firebase'

const VAPID_KEY =
  'BBjnTEpCnacbTbMLCY61vqDhHY7mFUtwtsA6vL4OrFD-MlhqPa3hkdugrHwxcGHzr3YFKOvpctK0S6t3v09ZoCM'

// 👉 xin quyền + lấy token
export async function initFCM() {
  const permission = await Notification.requestPermission()

  if (permission !== 'granted') {
    console.log('❌ Không có quyền thông báo')
    return null
  }

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
  })

  console.log('🔥 FCM TOKEN:', token)

  return token
}

// 👉 nhận khi đang mở app

export function listenFCM() {
  onMessage(messaging, async (payload) => {
    console.log('📩 Foreground message:', payload)

    const title = payload.notification?.title || '🌱 Thông báo'
    const body = payload.notification?.body || ''

    console.log('🚀 Hiện notification:', title)

    // 🔥 QUAN TRỌNG: dùng đúng service worker Firebase
    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')

    if (registration) {
      registration.showNotification(title, {
        body,
      })
    } else {
      console.error('❌ Không tìm thấy firebase-messaging-sw.js')
    }
  })
}
