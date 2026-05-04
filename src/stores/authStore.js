import { defineStore } from 'pinia'
import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  // 🔥 giữ resolve trong closure an toàn
  let resolveReady

  const ready = new Promise((resolve) => {
    resolveReady = resolve
  })

  function init() {
    console.log('🚀 Init auth listener')

    onAuthStateChanged(auth, (u) => {
      console.log('🔄 [AUTH STATE]')
      console.log('👉 user:', u)

      user.value = u
      loading.value = false

      if (u) {
        console.log('✅ UID:', u.uid)
        console.log('✅ isAnonymous:', u.isAnonymous)
      } else {
        console.warn('❌ User NULL')
      }

      // 🔥 tránh crash nếu resolve chưa có
      if (resolveReady) {
        resolveReady()
        resolveReady = null // chỉ resolve 1 lần
      }
    })
  }

  return {
    user,
    loading,
    init,
    ready,
  }
})