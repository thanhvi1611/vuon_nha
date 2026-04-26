import { defineStore } from 'pinia'
import { ref } from 'vue'
import { onAuthStateChanged} from 'firebase/auth'
import { auth } from '@/firebase'
import { signOut, signInAnonymously } from 'firebase/auth'
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  let initialized = false
  let unsubscribe = null

  let _resolve
  const ready = new Promise((resolve) => {
    _resolve = resolve
  })

  async function init() {
    if (initialized) return // 🔥 tránh init nhiều lần
    initialized = true

    unsubscribe = onAuthStateChanged(auth, async (u) => {
      console.log('👤 Auth changed:', u?.uid)

      // 👉 nếu chưa login → auto anonymous
      if (!u) {
        console.log('👤 Đang tạo anonymous user...')
        await signInAnonymously(auth)
        return
      }

      user.value = u
      loading.value = false

      // 👉 chỉ resolve 1 lần
      if (_resolve) {
        _resolve()
        _resolve = null
      }
    })
  }

  function destroy() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
  async function logout() {
  try {
    await signOut(auth)
    console.log('🚪 Đã logout')

    // 🔥 QUAN TRỌNG: tạo lại anonymous user
    await signInAnonymously(auth)

    console.log('👤 Đã quay lại anonymous')
  } catch (err) {
    console.error('❌ Logout lỗi:', err)
  }
}

  return {
    user,
    loading,
    init,
    ready,
    destroy,
   logout, 

  }
})
