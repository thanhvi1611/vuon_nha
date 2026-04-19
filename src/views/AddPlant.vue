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

  // 1. Thêm cây mới
  const newPlant = await store.addPlant({
    name: selectedPlant.value.name,
    type: selectedPlant.value.id,
    startDate: startDate.value,
    image: selectedPlant.value.image || '',
  })

  // 2. Tạo các task chăm sóc mặc định kèm reminderTimes
  if (newPlant) {
    await createDefaultTasks(newPlant.id, startDate.value)
  }

  router.push('/')
}

// ==================== TẠO TASK MẶC ĐỊNH ====================
async function createDefaultTasks(plantId, startDateStr) {
  const start = dayjs(startDateStr)

  const defaultTasks = [
    {
      title: 'Tưới nước lần đầu',
      date: start.format('YYYY-MM-DD'),
      reminderTimes: ['07:30', '16:30'],
    },
    {
      title: 'Kiểm tra đất và độ ẩm',
      date: start.add(2, 'day').format('YYYY-MM-DD'),
      reminderTimes: ['08:00'],
    },
    {
      title: 'Bón phân hữu cơ',
      date: start.add(7, 'day').format('YYYY-MM-DD'),
      reminderTimes: ['09:00', '17:00'],
    },
    {
      title: 'Kiểm tra sâu bệnh',
      date: start.add(10, 'day').format('YYYY-MM-DD'),
      reminderTimes: ['07:45'],
    },
    {
      title: 'Tưới nước định kỳ',
      date: start.add(14, 'day').format('YYYY-MM-DD'),
      reminderTimes: ['07:30', '16:30'],
    },
  ]

  for (const task of defaultTasks) {
    await store.addTask({
      plantId: plantId,
      title: task.title,
      date: task.date,
      done: false,
      reminderTimes: task.reminderTimes,
    })
  }

  console.log(`🌱 Đã tạo ${defaultTasks.length} task mặc định cho cây mới`)
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

      <!-- PREVIEW -->
      <div
        v-if="selectedPlant"
        class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-100 to-green-50 border border-green-200"
      >
        <div class="text-4xl">{{ selectedPlant.icon }}</div>
        <div>
          <p class="font-semibold text-gray-900">{{ selectedPlant.name }}</p>
          <p class="text-xs text-gray-500">
            {{ selectedPlant.duration }} ngày • {{ selectedPlant.careLevel || 'Dễ chăm' }}
          </p>
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
        class="w-full rounded-2xl px-4 py-3 bg-white/80 border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-base"
      />
    </div>

    <!-- CTA -->
    <button
      @click="add"
      :disabled="!type || !startDate"
      class="w-full py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-200 active:scale-95 transition disabled:opacity-50"
    >
      Thêm cây và tạo lịch chăm sóc 🌿
    </button>
  </div>
</template>
