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
  onMessage(messaging, (payload) => {
    console.log('📩 Foreground message:', payload)

    // ❗ CHECK permission
    if (Notification.permission !== 'granted') {
      console.warn('❌ Chưa có quyền notification')
      return
    }

    // ❗ LẤY DATA AN TOÀN (tránh undefined)
    const title = payload.notification?.title || '🌱 Thông báo'
    const body = payload.notification?.body || 'Có việc cần làm'

    console.log('🚀 Hiện notification:', title)

    // 🔥 FIX QUAN TRỌNG: thêm setTimeout
    setTimeout(() => {
      new Notification(title, {
        body: body,
        icon: '/icon.png',
      })
    }, 100)
  })
}
