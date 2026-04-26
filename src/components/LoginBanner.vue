<script setup>
import { upgradeToGoogle } from '@/services/auth'
import { useAuthStore } from '@/stores/authStore'
import { usePlantStore } from '@/stores/plantStore'

const plantStore = usePlantStore()
const authStore = useAuthStore()

async function handleLogin() {
  try {
    await upgradeToGoogle()

    // 👉 nếu local có data → sync lên
    if (plantStore.plants.length > 0) {
      await plantStore.syncToCloud()
    }

    // 👉 nếu local trống → load về
    if (plantStore.plants.length === 0) {
      await plantStore.loadFromCloud()
    }

    console.log('🎉 Merge OK')
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