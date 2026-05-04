<!-- src/components/LoginBanner.vue -->
<script setup>
import { ref } from 'vue'
import {
  startGoogleLogin,
  loginWithRedirectGoogle,
} from '@/services/auth'

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    // Ưu tiên One Tap / FedCM
    const ok = await startGoogleLogin()

    // nếu bị block / skip => fallback redirect
    if (!ok) {
      await loginWithRedirectGoogle()
    }
  } catch (err) {
    console.error(err)
    error.value = 'Không thể đăng nhập'

    try {
      await loginWithRedirectGoogle()
    } catch (e) {
      console.error(e)
    }
  }

  loading.value = false
}
</script>

<template>
  <div
    class="p-3 bg-yellow-100 border-b border-yellow-200 flex items-center justify-between gap-3"
  >
    <div class="text-sm">
      <div class="font-semibold">🔐 Đăng nhập để đồng bộ dữ liệu</div>
      <div class="text-xs text-gray-600">
        Giữ cây trồng & task khi đổi điện thoại
      </div>

      <div
        v-if="error"
        class="text-red-500 text-xs mt-1"
      >
        {{ error }}
      </div>
    </div>

    <button
      @click="handleLogin"
      :disabled="loading"
      class="px-3 py-2 rounded-xl bg-blue-500 text-white text-sm shrink-0"
    >
      {{ loading ? '...' : 'Đăng nhập Google' }}
    </button>
  </div>
</template>