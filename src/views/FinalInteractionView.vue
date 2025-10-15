<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#2071b5]"
      ></div>
      <p class="mt-6 text-xl text-[#2071b5] font-vattenfall">Loading your ideas...</p>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else class="min-h-screen bg-white">
    <!-- Fixed Header Section -->
    <div class="fixed top-0 left-0 right-0 bg-white z-50 border-b-1 border-[#B5B5B5]">
      <VattenfallHeader title="" />

      <div class="px-[48px] pb-6">
        <PageTitle title="Thanks for sharing" :show-close="true" close-route="/" />

        <!-- Subtitle with Button -->
        <div class="flex items-center justify-between -mt-6">
          <p class="text-lg leading-[1.5] text-black font-vattenfall">
            Your idea breathes new life into a<br />retired wind turbine.
          </p>
        </div>
      </div>
    </div>

    <!-- Spacer to push content below fixed header -->
    <div class="h-[300px]"></div>

    <!-- Main Content Area -->
    <div class="px-[48px] pb-12">
      <!-- Two Column Layout: Image Card + Achievement Card -->
      <div class="grid grid-cols-5 gap-16 my-12">
        <!-- Left Column: Image Card -->
        <div v-if="latestConversation" class="bg-[#F9F9F9] rounded-md p-3 col-span-3">
          <!-- Image -->
          <div class="flex flex-col p-3 h-5/6 space-y-6">
            <img
              :src="latestImage"
              :alt="latestTitle"
              class="w-full h-full object-contain rounded-md"
            />
            <!-- <p class="text-sm">AI Image created with Vattenfall Rewind (DDW25)</p> -->
            <!-- Title -->
            <h3
              class="text-2xl leading-[1.3] capitalize font-vattenfall font-semibold text-[#2071b5] mb-2"
            >
              {{ latestTitle || "Idea title goes here" }}
            </h3>
            <!-- Part Label -->
            <p class="text-lg leading-[1.5] text-gray-600 font-vattenfall mb-3">
              {{ selectedPartsLabel }}
            </p>

            <!-- Description -->
            <p class="text-md font-vattenfall text-gray-700 mb-4">
              {{
                latestDescription ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et"
              }}
            </p>

            <!-- Tags -->
            <div class="flex gap-2 flex-wrap">
              <span
                v-for="(tag, index) in latestTags"
                :key="index"
                class="px-3 py-1.5 bg-[#e8f2f7] text-[#2071b5] rounded-full text-[11px] font-vattenfall border border-[#2071b5]"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Column: Achievement Card + QR Code -->
        <div class="flex flex-col gap-6 col-span-2 justify-between">
          <!-- Achievement Card -->
          <div class="">
            <h2
              class="text-4xl leading-[1.2] font-vattenfall-display font-bold text-[#2071b5] mb-4"
            >
              {{ achievementTitle }}
            </h2>
            <p class="text-xl leading-[1.5] text-[#2071b5] font-vattenfall mb-4">
              You successfully tackled the complexity of level:
            </p>
            <div class="inline-block">
              <span
                :class="[
                  'px-5 py-2 rounded-full text-sm font-vattenfall font-medium',
                  difficultyBadgeClasses,
                ]"
              >
                {{ difficultyLabel }}
              </span>
            </div>
          </div>

          <!-- QR Code Section -->
          <div v-if="shareableUrl" class="flex flex-col relative">
            <!-- Dotted arrow decoration -->
            <img :src="dottedSwiggleSmall" alt="" class="absolute -right-1 top-0 w-32 h-32" />

            <p class="text-md font-vattenfall mb-6 text-[#2071b5]">
              Scan to view and<br />share your idea!
            </p>
            <div class="flex">
              <QRCodeDisplay :url="shareableUrl" :size="200" label="" />
            </div>
          </div>
        </div>
      </div>

      <!-- Idea Counter Section -->
      <div class="w-full pb-16">
        <IdeaCounter :idea-count="ideaCount" :show-button="false" />
      </div>
      <!-- Image Gallery Section -->
      <div class="w-full pb-16 relative">
        <!-- Large dotted arrow decoration -->
        <img
          :src="dottedSwiggleBig"
          alt=""
          class="z-0 absolute left-72 -top-18 w-80 h-64 pointer-events-none"
        />

        <!-- Windmill illustration -->
        <img :src="windmillIllustration" alt="" class="absolute right-12 -top-52 w-96 h-96" />

        <ImageGallery :ideas="galleryIdeas" :total-ideas="totalIdeas" />
      </div>
    </div>
    <!-- Fixed Footer -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e5e5] z-30">
      <div class="flex items-center justify-end px-[48px] py-[32px] max-w-[1400px] mx-auto">
        <!-- New IDEA -->
        <PrimaryButton label="Submit another idea" @click="submitAnother" size="huge" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import BackButton from "../components/BackButton.vue";
import ImageGallery from "../components/ImageGallery.vue";
import QRCodeDisplay from "../components/QRCodeDisplay.vue";
import IdeaCounter from "../components/IdeaCounter.vue";
import type { IdeaData } from "../components/ImageGallery.vue";
import { useFirebaseData } from "../composables/useFirebaseData";
import { useSelectedPart } from "../composables/useSelectedPart";
import { useInactivityTimeout } from "../composables/useInactivityTimeout";

// Import SVG assets
import dottedSwiggleSmall from "@/assets/images/dottedswiggle-small.svg";
import dottedSwiggleBig from "@/assets/images/dottedswiggle-big.svg";
import windmillIllustration from "@/assets/images/windmill_illustration.svg";

const router = useRouter();
const { getLatestConversation, getPreviousConversations, fetchAllConversations } =
  useFirebaseData();
const { getDifficulty, clearSelectedParts, getSelectedParts } = useSelectedPart();

// Inactivity timeout - 120 seconds
// Note: clearSelectedParts() is handled by router guard, no need to call it here
useInactivityTimeout({
  timeoutSeconds: 120,
  redirectTo: "/",
});

// Get current difficulty
const currentDifficulty = ref(getDifficulty());

// Loading state
const isLoading = ref(true);

// Data refs
const ideaCount = ref(0);
const latestConversation = ref<any>(null);
const previousConversations = ref<any[]>([]);
const totalIdeas = ref(0);

// Load data on mount - do this ONCE efficiently
onMounted(async () => {
  try {
    const allConversations = await fetchAllConversations();

    ideaCount.value = allConversations.length;
    totalIdeas.value = allConversations.length;

    if (allConversations.length > 0) {
      latestConversation.value = allConversations[0];
      // Filter to only show conversations with image URLs
      previousConversations.value = allConversations.slice(1).filter((conv) => conv.image_url);
    }
  } catch (error) {
    console.error("Error loading conversations:", error);
  } finally {
    isLoading.value = false;
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

const latestTags = computed(() => {
  if (!latestConversation.value) return [];
  return latestConversation.value.key_phrases || [];
});

// Selected parts label
const selectedPartsLabel = computed(() => {
  const parts = getSelectedParts();
  if (parts.length === 0) return "Part: None selected";

  const partNames = parts.map((p) => p.name).join(", ");
  return parts.length === 1 ? `Part: ${partNames}` : `Parts: ${partNames}`;
});

// Achievement Card - Dynamic based on difficulty
const achievementTitle = computed(() => {
  switch (currentDifficulty.value) {
    case "easy":
      return "You are awesome!";
    case "medium":
      return "You are simply brilliant!";
    case "difficult":
      return "You are a total maverick!";
    default:
      return "You are awesome!";
  }
});

const difficultyLabel = computed(() => {
  switch (currentDifficulty.value) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "difficult":
      return "Difficult";
    default:
      return "Easy";
  }
});

const difficultyBadgeClasses = computed(() => {
  switch (currentDifficulty.value) {
    case "easy":
      return "bg-[#e3f2fd] text-[#1976d2]";
    case "medium":
      return "bg-[#e0f2f1] text-[#00796b]";
    case "difficult":
      return "bg-[#ffe6e6] text-[#d32f2f]";
    default:
      return "bg-[#e3f2fd] text-[#1976d2]";
  }
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
    tags: conv.key_phrases || [],
  }));
});

const submitAnother = async () => {
  //goes to partsview and then refreshed the page
  await router.push({ path: "/choose" });
  router.go(0);
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
