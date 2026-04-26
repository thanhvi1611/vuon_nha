<script setup>
import { upgradeToGoogle } from '@/services/auth'
import { useAuthStore } from '@/stores/authStore'
import { usePlantStore } from '@/stores/plantStore'

const plantStore = usePlantStore()
const authStore = useAuthStore()

async function handleLogin() {
  try {
    await upgradeToGoogle()

    // 🔥 QUAN TRỌNG
    await plantStore.syncToCloud()
    console.log('🎉 Merge hoàn tất')
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div
    v-if="!authStore.loading && authStore.user?.isAnonymous"
    class="p-3 bg-yellow-100 text-sm flex items-center justify-between"
  >
    <span>👉 Bạn đang dùng chế độ khách</span>

    <button
      @click="handleLogin"
      class="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs"
    >
      Đăng nhập Google
    </button>
  </div>
</template>