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
  console.log('[FCM] Background message:', payload)
  self.registration.showNotification(payload.notification?.title || '🌱 Lịch làm vườn', {
    body: payload.notification?.body || '',
  })
})
