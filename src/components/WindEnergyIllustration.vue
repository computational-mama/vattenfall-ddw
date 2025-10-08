<template>
  <div class="relative w-full h-full rounded-none">
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
import welcomeImage1 from "@/assets/images/welcomeImage1.svg";
import welcomeImage2 from "@/assets/images/welcomeImage2.svg";
import welcomeImage3 from "@/assets/images/welcomeImage3.svg";

interface Props {
  currentIndex?: number;
  totalImages?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0,
  totalImages: 3,
});

const welcomeImages = [welcomeImage1, welcomeImage2, welcomeImage3];
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
