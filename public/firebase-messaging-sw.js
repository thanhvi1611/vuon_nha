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
})

const messaging = firebase.messaging()

// 🔥 BACKGROUND MESSAGE
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM] Background message:', payload)

  const title = payload.notification?.title || '🌱 Lịch làm vườn'

  self.registration.showNotification(title, {
    body: payload.notification?.body || '',
    data: payload.data, // 👈 QUAN TRỌNG
  })
})

// 🔥 CLICK NOTIFICATION
self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(url)) {
          return client.focus()
        }
      }

      return clients.openWindow(url)
    }),
  )
})
