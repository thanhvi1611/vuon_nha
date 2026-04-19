<script setup>
import BottomNav from '@/components/layout/BottomNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
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
