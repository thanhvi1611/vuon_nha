<script setup>
import { useRouter } from 'vue-router'
import { usePlantStore } from '@/stores/plantStore'

const props = defineProps({
  plant: Object,
})

const store = usePlantStore()
const router = useRouter()

function openDetail() {
  router.push(`/plant/${props.plant.id}`)
}

function onUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = async () => {
    await store.updatePlant(props.plant.id, {
      image: reader.result,
    })
  }

  reader.readAsDataURL(file)
}
</script>

<template>
  <div
    @click="openDetail"
    class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition hover:shadow-md active:scale-[0.99]"
  >
    <!-- IMAGE -->
    <div class="relative h-40 bg-gray-100">
      <img v-if="plant.image" :src="plant.image" class="w-full h-full object-cover" />

      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        🌱 Chưa có ảnh
      </div>

      <!-- upload button -->
      <label
        class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg cursor-pointer"
        @click.stop
      >
        📷
        <input type="file" accept="image/*" class="hidden" @change="onUpload" />
      </label>
    </div>

    <!-- CONTENT -->
    <div class="p-4 space-y-2">
      <!-- NAME + PROGRESS -->
      <div class="flex justify-between items-center">
        <h2 class="font-semibold text-gray-900">
          {{ plant.name }}
        </h2>

        <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
          {{ plant.progress }}%
        </span>
      </div>

      <!-- STAGE -->
      <p class="text-sm text-gray-500">
        {{ plant.stage?.name }}
      </p>

      <!-- PROGRESS BAR -->
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-green-500 transition-all" :style="{ width: plant.progress + '%' }" />
      </div>
    </div>
  </div>
</template>
