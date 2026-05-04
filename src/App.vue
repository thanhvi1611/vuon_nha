<!-- src/App.vue -->
<script setup>
import { computed, onMounted } from 'vue'

import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import LoginBanner from '@/components/LoginBanner.vue'

import { useAuthStore } from '@/stores/authStore'
import { usePlantStore } from '@/stores/plantStore'

import { handleRedirectResultLogin } from '@/services/auth'

const authStore = useAuthStore()
const plantStore = usePlantStore()

const user = computed(() => authStore.user)
const loading = computed(() => authStore.loading)

/* ===================================
   INIT APP
=================================== */
onMounted(async () => {
  // xử lý redirect login quay về
  await handleRedirectResultLogin()

  // load local data
  await plantStore.load()

  // nếu đã login thì kéo cloud data
  if (authStore.user && !authStore.user.isAnonymous) {
    if (plantStore.loadFromCloud) {
      await plantStore.loadFromCloud()
    }
  }

  // load script google one tap
  injectGoogleScript()
})

/* ===================================
   GOOGLE SCRIPT
=================================== */
function injectGoogleScript() {
  if (document.getElementById('google-client-script')) return

  const script = document.createElement('script')
  script.id = 'google-client-script'
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true

  document.head.appendChild(script)
}
</script>

<template>
  <div class="min-h-dvh bg-[rgb(var(--color-bg))] text-gray-800">
    <!-- login banner chỉ hiện guest -->
    <LoginBanner
      v-if="!loading && (!user || user.isAnonymous)"
    />

    <!-- header -->
    <AppHeader />

    <!-- main -->
    <main class="px-4 pt-4 pb-24 space-y-4">
      <div
        v-if="loading"
        class="bg-white rounded-2xl border p-4 text-sm text-gray-500"
      >
        ⏳ Đang kiểm tra đăng nhập...
      </div>

      <div
        v-else-if="user && !user.isAnonymous"
        class="bg-white rounded-2xl border p-4 text-sm"
      >
        <div class="font-semibold">
          👤 {{ user.displayName || 'Người dùng' }}
        </div>

        <div class="text-xs text-gray-500 mt-1">
          {{ user.email }}
        </div>
      </div>

      <router-view />
    </main>

    <!-- bottom -->
    <BottomNav />
  </div>
</template>