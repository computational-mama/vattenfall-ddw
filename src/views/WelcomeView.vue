<template>
  <div class="min-h-screen bg-white flex flex-col relative overflow-hidden">
    <!-- Logo -->
    <div class="absolute left-1/2 -translate-x-1/2 top-[48px] w-[231px] h-[77px] z-20">
      <VattenfallLogo variant="linear-grey" size="large" />
    </div>

    <!-- Hero Text -->
    <div class="absolute left-[90px] top-[244px] w-[900px] z-20">
      <HeroText
        :highlight-text="carouselContent[currentImageIndex].highlightText"
        :highlight-color="carouselContent[currentImageIndex].highlightColor"
        :additional-text="carouselContent[currentImageIndex].additionalText"
        :secondary-color="carouselContent[currentImageIndex].secondaryColor"
        :ending="carouselContent[currentImageIndex].ending"
      />
    </div>

    <!-- Wind Energy Illustration with Carousel -->
    <div class="absolute left-[48px] top-[362px] w-[984px] h-[1180px] z-0">
      <WindEnergyIllustration :current-index="currentImageIndex" :total-images="3" />
    </div>

    <!-- Progress Indicator -->
    <div class="absolute left-[48px] top-[1590px] w-[984px] z-20">
      <ProgressIndicator :current-step="currentImageIndex + 1" :total-steps="3" />
    </div>

    <!-- Bottom Section -->
    <div
      class="absolute bottom-[48px] left-1/2 -translate-x-1/2 w-[984px] h-[200px] flex items-center justify-between py-[40px] z-20"
    >
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
import { useFirebaseData } from "../composables/useFirebaseData";

const { fetchAllConversations } = useFirebaseData();

// Fetch idea count from Firebase
const ideaCount = ref(0);

onMounted(async () => {
  const allConversations = await fetchAllConversations();
  ideaCount.value = allConversations.length;
  startCarousel();
});

// Carousel content for each slide
const carouselContent = [
  {
    highlightText: "parts",
    highlightColor: "yellow" as const,
    additionalText: "Canal Bridge",
    secondaryColor: "blue" as const,
    ending: "Canal Bridge",
  },
  {
    highlightText: "blades",
    highlightColor: "yellow" as const,
    additionalText: "Surf boards",
    secondaryColor: "blue" as const,
    ending: "Surf boards",
  },
  {
    highlightText: "nacelle",
    highlightColor: "yellow" as const,
    additionalText: "Hotel rooms",
    secondaryColor: "blue" as const,
    ending: "Hotel rooms",
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

onUnmounted(() => {
  stopCarousel();
});
</script>
