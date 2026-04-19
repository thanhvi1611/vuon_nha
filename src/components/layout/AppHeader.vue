<script setup>
import dayjs from 'dayjs'

const today = dayjs().format('DD/MM')
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
    <div class="px-4 pt-4 pb-3 space-y-3">
      <!-- Top row -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold">🌱 Vườn Nhà</h1>
          <p class="text-xs text-gray-400">Hôm nay {{ today }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <button
            class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition"
          >
            🔍
          </button>

          <button
            class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition"
          >
            ⚙️
          </button>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="flex gap-2">
        <div
          class="flex-1 bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))] rounded-xl px-3 py-2 text-sm"
        >
          🌿 3 cây đang trồng
        </div>

        <div class="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm">⏰ 2 việc hôm nay</div>
      </div>
    </div>
  </header>
</template>
