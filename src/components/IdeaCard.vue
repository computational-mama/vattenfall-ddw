<template>
  <div class="idea-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
    <!-- Header: Part Name & Idea Count -->
    <div class="p-4 flex items-center gap-3">
      <div v-if="partIcon" class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
        <img :src="partIcon" :alt="partName" class="w-6 h-6 object-contain" />
      </div>
      <div v-else class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-base font-semibold text-gray-900 font-vattenfall">{{ partName }}</h3>
        <p class="text-sm text-gray-500 font-vattenfall">{{ ideaCount }} ideas</p>
      </div>
    </div>

    <!-- Image -->
    <div class="relative aspect-square bg-gray-100">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="ideaTitle"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Idea Title -->
    <div class="p-4">
      <p class="text-sm font-medium text-gray-700 font-vattenfall line-clamp-2">{{ ideaTitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  partName: string
  ideaCount: number
  imageUrl: string
  ideaTitle: string
  partIcon?: string
}

const props = defineProps<Props>()

const imageError = ref(false)

const onImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
