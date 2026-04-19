self.addEventListener('install', () => {
  console.log('SW installed')
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  console.log('SW activated')
})

self.addEventListener('push', function (event) {
  const data = event.data?.json() || {}

  const title = data.title || '🌱 Nhắc chăm cây'
  const options = {
    body: data.body || 'Đến giờ chăm cây rồi!',
    icon: '/icon.png',
    badge: '/icon.png',
    data: data.url || '/',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const client = clientsArr.find((c) => c.focus)
      if (client) return client.focus()
      return clients.openWindow(event.notification.data)
    }),
  )
})
