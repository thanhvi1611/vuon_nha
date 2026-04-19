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

// 👉 nhận push khi app đang background
messaging.onBackgroundMessage(function (payload) {
  console.log('📩 Background message:', payload)

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png',
  })
})
