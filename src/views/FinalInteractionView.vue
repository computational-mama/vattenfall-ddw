<template>
  <div class="min-h-screen bg-white flex flex-col relative overflow-hidden">
    <!-- Background SVG -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
      <img src="../assets/images/bg-closepage.svg" alt="" class="w-full h-full object-contain" />
    </div>

    <!-- Content Container -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Logo -->
      <div class="w-full flex justify-center pt-12 pb-8">
        <VattenfallLogo variant="linear-grey" size="large" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center justify-start px-8 pt-8">
        <!-- Image Card -->
        <div v-if="latestConversation" class="mb-8">
          <ImageCard
            :image-src="latestImage"
            :title="latestTitle"
            :description="latestDescription"
          />
        </div>

        <!-- Thank You Message -->
        <div class="text-center mb-12 max-w-3xl">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-vattenfall">
            Thank you for participating!
          </h1>
          <p class="text-xl md:text-2xl text-gray-700 font-vattenfall">
            Your idea breathes life back into a<br />decommissioned windmill.
          </p>
        </div>

        <!-- QR Code -->
        <div v-if="shareableUrl" class="mb-12">
          <QRCodeDisplay :url="shareableUrl" :size="256" label="Scan to save and share your idea" />
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mb-16">
          <PrimaryButton label="End session" variant="secondary" @click="endSession" />
          <PrimaryButton label="Submit another idea" variant="primary" @click="submitAnother" />
        </div>

        <!-- Image Gallery Section -->
        <div class="w-full max-w-7xl pb-16">
          <ImageGallery :ideas="galleryIdeas" :total-ideas="totalIdeas" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import VattenfallLogo from "../components/VattenfallLogo.vue";
import ImageCard from "../components/ImageCard.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import ImageGallery from "../components/ImageGallery.vue";
import QRCodeDisplay from "../components/QRCodeDisplay.vue";
import type { IdeaData } from "../components/ImageGallery.vue";
import { useFirebaseData } from "../composables/useFirebaseData";

const router = useRouter();
const { getLatestConversation, getPreviousConversations, fetchAllConversations } =
  useFirebaseData();

// Data refs
const latestConversation = ref<any>(null);
const previousConversations = ref<any[]>([]);
const totalIdeas = ref(0);

// Load data on mount - do this ONCE efficiently
onMounted(async () => {
  const allConversations = await fetchAllConversations();

  if (allConversations.length > 0) {
    latestConversation.value = allConversations[0];
    previousConversations.value = allConversations.slice(1, 7);
    totalIdeas.value = allConversations.length;
  }
});

// Computed properties for ImageCard
const latestImage = computed(() => {
  if (!latestConversation.value) return "";
  return latestConversation.value.image_url || "";
});

const latestTitle = computed(() => {
  if (!latestConversation.value) return "";
  return latestConversation.value.key_phrases?.[0] || "";
});

const latestDescription = computed(() => {
  if (!latestConversation.value) return "";
  return latestConversation.value.summary || "";
});

// Computed property for QR code URL
const shareableUrl = computed(() => {
  if (!latestConversation.value?.firebaseKey) return "";
  return `https://vattenfall-ddw.vercel.app/idea/${latestConversation.value.firebaseKey}`;
});

// Computed properties for ImageGallery
const galleryIdeas = computed((): IdeaData[] => {
  if (!previousConversations.value.length) return [];

  return previousConversations.value.map((conv) => ({
    partName: conv.key_phrases?.[0] || "",
    ideaCount: conv.key_phrases?.length || 0,
    imageUrl: conv.image_url || "",
    ideaTitle: conv.summary || "",
    partIcon: "",
  }));
});

const endSession = () => {
  // Navigate to welcome page
  router.push("/");
};

const submitAnother = () => {
  // Navigate to parts selection
  router.push("/choose");
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
