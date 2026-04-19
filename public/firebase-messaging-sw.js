importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDDyRDW87YQ0ryJFxz6fzqug860at2K5R0',
  authDomain: 'vuon-d9e6a.firebaseapp.com',
  projectId: 'vuon-d9e6a',
  messagingSenderId: '374287500808',
  appId: '1:374287500808:web:6b7d177cc6adfb8dd533bd',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[FCM] Background message received:', payload)

  const title = payload.notification?.title || '🌱 Lịch làm vườn'
  const body = payload.notification?.body || 'Bạn có công việc cần làm'

  self.registration
    .showNotification(title, {
      body: body,
      icon: '/icons/plant-192.png', // Phải tồn tại file này
      badge: '/icons/badge-72.png',
      tag: 'plant-care-' + Date.now(),
      vibrate: [100, 50, 100],
      requireInteraction: false,
    })
    .then(() => {
      console.log('✅ showNotification called successfully')
    })
    .catch((err) => {
      console.error('❌ showNotification error:', err)
    })
})

// Click thông báo
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
