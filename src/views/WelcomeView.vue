<template>
  <div
    class="min-h-screen bg-white flex flex-col items-center justify-between py-12 px-8 overflow-hidden"
  >
    <!-- Logo -->
    <div class="w-full flex justify-center mb-8">
      <VattenfallLogo variant="linear-grey" size="large" />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto relative">
      <!-- Hero Text -->
      <div class="mt-8 mb-auto z-10">
        <HeroText
          :highlight-text="carouselContent[currentImageIndex].highlightText"
          :highlight-color="carouselContent[currentImageIndex].highlightColor"
          :additional-text="carouselContent[currentImageIndex].additionalText"
          :secondary-color="carouselContent[currentImageIndex].secondaryColor"
          :ending="carouselContent[currentImageIndex].ending"
        />
      </div>

      <!-- Wind Energy Illustration with Carousel -->
      <div class="absolute inset-0 flex items-center justify-center opacity-90">
        <WindEnergyIllustration :current-index="currentImageIndex" :total-images="3" />
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="w-full flex flex-col items-center gap-12 z-10">
      <!-- Progress Indicator -->
      <ProgressIndicator :current-step="currentImageIndex + 1" :total-steps="3" />

      <!-- Idea Counter & CTA -->
      <IdeaCounter :idea-count="ideaCount" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import VattenfallLogo from "../components/VattenfallLogo.vue";
import HeroText from "../components/HeroText.vue";
import WindEnergyIllustration from "../components/WindEnergyIllustration.vue";
import ProgressIndicator from "../components/ProgressIndicator.vue";
import IdeaCounter from "../components/IdeaCounter.vue";

// Placeholder for Firebase connection - will be replaced later
const ideaCount = ref(64);

// Carousel content for each slide
const carouselContent = [
  {
    highlightText: "parts",
    highlightColor: "yellow" as const,
    additionalText: undefined,
    secondaryColor: "blue" as const,
    ending: "...",
  },
  {
    highlightText: "blades",
    highlightColor: "yellow" as const,
    additionalText: "to make surf boards.",
    secondaryColor: "blue" as const,
    ending: "",
  },
  {
    highlightText: "nacelle",
    highlightColor: "yellow" as const,
    additionalText: "to make hotel rooms.",
    secondaryColor: "blue" as const,
    ending: "",
  },
];

// Carousel state
const currentImageIndex = ref(0);
const carouselInterval = ref<number | null>(null);

// Auto-rotate carousel every 5 seconds
const startCarousel = () => {
  carouselInterval.value = window.setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % 3;
  }, 2000);
};

const stopCarousel = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value);
    carouselInterval.value = null;
  }
};

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  stopCarousel();
});
</script>
