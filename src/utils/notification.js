// utils/useNotification.js
import { onMounted } from 'vue'
import dayjs from 'dayjs'
import { db } from '@/db'

export function useNotification() {
  const testNotification = () => {
    new Notification('🧪 Test Notification', {
      body: 'Nếu bạn thấy thông báo này thì hệ thống đang hoạt động',
      icon: '',
    })
  }

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('❌ Trình duyệt không hỗ trợ Notification')
      return false
    }

    console.log('📢 Current permission:', Notification.permission)

    if (Notification.permission === 'granted') {
      console.log('✅ Permission đã được cấp trước đó')
      return true
    }
    if (Notification.permission === 'denied') {
      console.warn('⛔ Permission bị từ chối')
      return false
    }

    console.log('🔄 Đang yêu cầu permission...')
    const permission = await Notification.requestPermission()
    console.log('📢 Kết quả request permission:', permission)
    return permission === 'granted'
  }

  const sendNotification1 = (title, body = 'Đến giờ chăm sóc cây rồi!') => {
    if (Notification.permission !== 'granted') {
      console.warn('⚠️ Không thể gửi thông báo vì permission chưa được cấp')
      return
    }

    console.log(`🚀 Đang gửi thông báo: "${title}"`)

    try {
      new Notification(`🌱 ${title}`, {
        body,
        icon: '/icons/plant-192.png', // thay bằng đường dẫn icon thật nếu có
        tag: `plant-task-${Date.now()}`,
      })
      console.log(`✅ Notification đã được tạo thành công: ${title}`)
    } catch (err) {
      console.error('❌ Lỗi khi tạo Notification:', err)
    }
  }
  const sendNotification = (title, body = 'Đến giờ chăm sóc cây rồi!') => {
    if (Notification.permission !== 'granted') {
      console.warn('⚠️ Permission chưa được cấp')
      return
    }

    console.log(`🚀 Đang tạo Notification: "${title}"`)

    try {
      const notification = new Notification(`🌱 ${title}`, {
        body: body,
        icon: '', // ← Bỏ icon tạm thời để test
        tag: `plant-task-${Date.now()}`,
        requireInteraction: false, // tự động đóng sau vài giây
      })

      console.log('✅ Notification object đã tạo:', notification)

      // Test click
      notification.onclick = () => {
        console.log('🖱️ Người dùng click vào thông báo')
        window.focus()
      }
    } catch (err) {
      console.error('❌ Lỗi khi tạo Notification:', err)
    }
  }
  // ==================== DEBUG VERSION ====================
  const checkAndNotifyTodayTasks = async () => {
    const today = dayjs().format('YYYY-MM-DD')
    const currentTime = dayjs().format('HH:mm')

    console.log(`\n🔍 [DEBUG] Kiểm tra lúc ${currentTime} | Ngày: ${today}`)

    try {
      const tasks = await db.tasks
        .where('date')
        .equals(today)
        .and((task) => !task.done)
        .toArray()

      console.log(`📋 Tìm thấy ${tasks.length} task chưa hoàn thành hôm nay`)

      if (tasks.length === 0) {
        console.log('ℹ️ Không có task nào hôm nay')
        return
      }

      for (const task of tasks) {
        const reminderTimes = task.reminderTimes || []
        console.log(`   🌱 Task: "${task.title}" | Giờ nhắc:`, reminderTimes)

        if (reminderTimes.length === 0) {
          console.log(`   ⚠️ Task này chưa có reminderTimes`)
          continue
        }

        if (reminderTimes.includes(currentTime)) {
          console.log(`   🎯 ĐÚNG GIỜ NHẮC (${currentTime})`)

          const notifiedKey = `notified_${today}_${currentTime.replace(':', '')}`

          if (!task[notifiedKey]) {
            console.log(`   → Chuẩn bị gửi thông báo...`)
            sendNotification(task.title, `Nhắc nhở lúc ${currentTime}`)

            await db.tasks.update(task.id, { [notifiedKey]: true })
            console.log(`   ✅ Đã đánh dấu notified cho giờ ${currentTime}`)
          } else {
            console.log(`   ⚠️ Đã gửi thông báo cho giờ này rồi`)
          }
        }
      }
    } catch (err) {
      console.error('❌ Lỗi trong checkAndNotifyTodayTasks:', err)
    }
  }

  const startDailyNotification = () => {
    console.log('⏰ Bắt đầu hệ thống thông báo (kiểm tra mỗi 30 giây)')
    checkAndNotifyTodayTasks() // chạy ngay lập tức

    const interval = setInterval(() => {
      checkAndNotifyTodayTasks()
    }, 30000)

    return () => {
      console.log('🛑 Dừng interval thông báo')
      clearInterval(interval)
    }
  }

  // Auto request permission
  onMounted(() => {
    requestPermission()
  })

  return {
    requestPermission,
    startDailyNotification,
    checkAndNotifyTodayTasks,
  }
}

// Thêm vào startDailyNotification hoặc onMounted để test
