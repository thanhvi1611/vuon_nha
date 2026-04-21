/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAVPqEfFOxiiuuBzLfN-5c56TACbG885bA',
  authDomain: 'vuonannhien-cd467.firebaseapp.com',
  projectId: 'vuonannhien-cd467',
  storageBucket: 'vuonannhien-cd467.firebasestorage.app',
  messagingSenderId: '426802284269',
  appId: '1:426802284269:web:b645f01acc74ea0016aee4',
  measurementId: 'G-TS2X1SJWD5',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[FCM] Background message received →', payload)

  // Lấy title và body từ notification hoặc data
  const title = payload.notification?.title || payload.data?.title || '🌱 Lịch làm vườn'
  const body = payload.notification?.body || payload.data?.body || 'Bạn có công việc chăm sóc cây'

  console.log(`Đang hiển thị: ${title} - ${body}`)

  self.registration
    .showNotification(title, {
      body: body,
      icon: '/icons/plant-192.png', // thử dùng icon này, hoặc để trống ''
      tag: 'plant-care-' + Date.now(),
      vibrate: [200, 100, 200],
      requireInteraction: false,
    })
    .then(() => console.log('✅ showNotification called OK'))
    .catch((err) => console.error('❌ showNotification error:', err))
})

// Click thông báo mở app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})
