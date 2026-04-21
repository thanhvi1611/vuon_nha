<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

import { onMounted } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import { initFCM } from '@/utils/fcm'

const store = usePlantStore()

onMounted(async () => {
  const token = await initFCM()
  if (token) {
    store.fcmToken = token
    console.log('✅ Lưu token vào store:', token)
  }
})
</script>

<template>
  <div class="min-h-dvh bg-[rgb(var(--color-bg))] text-gray-800">
    <!-- Header -->
    <AppHeader />

    <!-- Content -->
    <main class="px-4 pt-4 pb-24">
      <router-view />
    </main>

    <!-- Bottom nav -->
    <BottomNav />
  </div>
</template>
