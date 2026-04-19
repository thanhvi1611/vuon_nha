// Addplant.vue
<script setup>
import { ref, computed } from 'vue'
import { usePlantStore } from '@/stores/plantStore'
import { useRouter } from 'vue-router'
import PlantSelector from '@/components/plant/PlantSelector.vue'
import { plantTemplates } from '@/data/plants'
import dayjs from 'dayjs'

const store = usePlantStore()
const router = useRouter()

const type = ref('')
const startDate = ref(dayjs().format('YYYY-MM-DD'))

const selectedPlant = computed(() => plantTemplates.find((p) => p.id === type.value))

async function add() {
  if (!type.value || !startDate.value) return

  const newPlantData = {
    name: selectedPlant.value.name,
    type: selectedPlant.value.id,
    startDate: startDate.value,
    image: selectedPlant.value.image || '',
  }

  // Thêm cây + tự động tạo tasks
  await store.addPlant(newPlantData)

  console.log('🌱 Đã thêm cây và tạo lịch chăm sóc thành công!')
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen p-5 space-y-6 bg-gradient-to-br from-green-50 via-white to-green-100">
    <!-- HEADER -->
    <div class="space-y-1">
      <h1 class="text-2xl font-bold text-gray-900">🌱 Thêm cây mới</h1>
      <p class="text-gray-500 text-sm">Bắt đầu hành trình trồng trọt của bạn</p>
    </div>

    <!-- SELECTOR CARD -->
    <div
      class="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-4 shadow-lg space-y-4"
    >
      <h2 class="text-sm font-semibold text-gray-600">Chọn loại cây</h2>
      <PlantSelector @select="(val) => (type = val)" />

      <div
        v-if="selectedPlant"
        class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-100 to-green-50 border border-green-200"
      >
        <div class="text-4xl">{{ selectedPlant.icon }}</div>
        <div>
          <p class="font-semibold text-gray-900">{{ selectedPlant.name }}</p>
          <p class="text-xs text-gray-500">{{ selectedPlant.duration }} ngày</p>
        </div>
      </div>
    </div>

    <!-- DATE CARD -->
    <div
      class="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-4 shadow-lg space-y-2"
    >
      <h2 class="text-sm font-semibold text-gray-600">Ngày bắt đầu trồng</h2>
      <input
        v-model="startDate"
        type="date"
        class="w-full rounded-2xl px-4 py-3 bg-white/80 border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none"
      />
    </div>

    <!-- BUTTON -->
    <button
      @click="add"
      :disabled="!type || !startDate"
      class="w-full py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-200 active:scale-95 disabled:opacity-50 transition"
    >
      Thêm cây và tạo lịch chăm sóc 🌿
    </button>
  </div>
</template>
