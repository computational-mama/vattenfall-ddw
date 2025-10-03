<template>
  <div class="relative w-full h-full flex items-center justify-center">
    <!-- Wind Energy Infrastructure Illustration with Carousel -->
    <transition name="fade" mode="out-in">
      <img
        :key="currentIndex"
        :src="welcomeImages[currentIndex]"
        alt="Wind Energy Infrastructure"
        class="w-full h-full object-contain"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentIndex?: number
  totalImages?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0,
  totalImages: 3
})

const welcomeImages = computed(() => {
  return Array.from({ length: props.totalImages }, (_, i) =>
    `/src/assets/images/welcomeImage${i + 1}.svg`
  )
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
