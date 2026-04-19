<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'Vườn', path: '/', icon: '🌱' },
  { name: 'Lịch', path: '/calendar', icon: '📅' },
  { name: 'Thêm', path: '/add', icon: '➕' },
]
</script>

<template>
  <nav class="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur border-t">
    <div class="flex justify-around py-2">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        @click="router.push(tab.path)"
        class="flex flex-col items-center text-xs transition"
        :class="route.path === tab.path ? 'text-[rgb(var(--color-primary))]' : 'text-gray-400'"
      >
        <span class="text-lg">{{ tab.icon }}</span>
        <span>{{ tab.name }}</span>
      </button>
    </div>
  </nav>
</template>
