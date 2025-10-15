<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header - Mobile optimized -->
    <div class="bg-[#f5f5f7] px-6 py-3">
      <div class="flex items-center">
        <img src="/src/assets/logos/vattenfall-logo.png" alt="Vattenfall" class="h-8 w-auto" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center px-4">
      <p class="text-lg md:text-xl text-gray-600 font-vattenfall">Loading idea...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !ideaData"
      class="flex-1 flex flex-col items-center justify-center px-4 md:px-8"
    >
      <h1 class="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-vattenfall text-center">
        Idea Not Found
      </h1>
      <p class="text-base md:text-xl text-gray-600 mb-8 font-vattenfall text-center">
        This idea doesn't exist or has been removed.
      </p>
      <button
        @click="goHome"
        class="px-8 py-3 bg-[#ffda00] text-black rounded-full font-vattenfall font-medium hover:bg-[#ffd700]"
      >
        Go to Home
      </button>
    </div>

    <!-- Idea Content -->
    <div v-else class="flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12 pb-48 relative">
      <div class="max-w-[600px] mx-auto">
        <!-- Main Title Section -->
        <div class="z-0 mb-8 md:mb-12 relative">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 font-vattenfall-display leading-tight"
          >
            Your Idea,<br />Brought to Life
          </h1>

          <!-- Windmill illustration - positioned on the right -->
          <img
            :src="windmillIllustration"
            alt=""
            class="absolute -right-14 -top-4 w-64 h-64 md:w-40 md:h-40 opacity-80"
          />

          <p class="text-base md:text-lg text-gray-700 font-vattenfall leading-relaxed mt-4">
            Here's the visual representation of your idea, generated through our campaign. Download
            and share it — your creativity helps shape a better future. To re-share the idea on
            Social Media use the following hashtags #Rewind #DDW25 #circulardesign #Vattenfall
          </p>
        </div>

        <!-- Idea Card -->
        <div class="bg-[#f5f5f7] rounded-3xl p-6 md:p-8 mb-6 z-50">
          <!-- Idea Title -->
          <h2
            class="text-2xl capitalize md:text-3xl font-semibold text-[#2071b5] mb-6 font-vattenfall"
          >
            {{ ideaTitle }}
          </h2>

          <!-- Generated Image -->
          <div class="mb-6">
            <img :src="ideaData.image_url" :alt="ideaTitle" class="w-full h-auto rounded-xl" />
          </div>

          <!-- Part Description (if available) -->
          <div v-if="ideaData.summary" class="mb-4">
            <p class="text-base md:text-lg text-gray-700 font-vattenfall leading-relaxed">
              {{ ideaData.summary }}
            </p>
          </div>

          <!-- Key Phrases -->
          <div
            v-if="ideaData.key_phrases && ideaData.key_phrases.length > 0"
            class="flex flex-wrap gap-2"
          >
            <span
              v-for="(phrase, index) in ideaData.key_phrases"
              :key="index"
              class="px-3 py-1.5 bg-[#e8f2f7] text-[#2071b5] rounded-full text-[11px] font-vattenfall border border-[#2071b5]"
            >
              {{ phrase }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Action Buttons at Bottom -->
    <div
      v-if="!loading && !error && ideaData"
      class="fixed bottom-0 w-full bg-white border-t border-gray-200 p-6 z-50"
    >
      <div class="mx-auto flex flex-col space-y-4">
        <!-- Download Image Button -->
        <button
          @click="downloadImage"
          class="w-full py-4 bg-[#ffda00] text-black rounded-full text-lg font-vattenfall font-light hover:bg-[#ffd700] transition-colors"
        >
          Download Image
        </button>

        <!-- Copy Link Button -->
        <button
          @click="copyLink"
          class="w-full py-4 bg-white text-[#2071b5] border-1 border-[#2071b5] rounded-full text-lg font-vattenfall font-light hover:bg-[#e8f2f7] transition-colors"
        >
          {{ linkCopied ? "Link Copied!" : "Copy Link" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import windmillIllustration from "@/assets/images/windmill_illustration.svg";

const route = useRoute();
const router = useRouter();

const ideaData = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const linkCopied = ref(false);

const ideaTitle = computed(() => {
  if (!ideaData.value) return "Idea title goes here";
  return ideaData.value.key_phrases?.[0] || ideaData.value.summary || "Idea title goes here";
});

const fetchIdeaById = async (id: string) => {
  try {
    const response = await fetch(
      `https://carbon-vattenfall-default-rtdb.firebaseio.com/data/${id}.json`,
    );

    if (!response.ok) {
      throw new Error("Idea not found");
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Idea not found");
    }

    ideaData.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

const goHome = () => {
  router.push("/");
};

const downloadImage = async () => {
  if (!ideaData.value?.image_url) return;

  try {
    const response = await fetch(ideaData.value.image_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${ideaTitle.value.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to download image:", err);
  }
};

const copyLink = async () => {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
};

onMounted(() => {
  const ideaId = route.params.id as string;
  if (ideaId) {
    fetchIdeaById(ideaId);
  } else {
    error.value = "No idea ID provided";
    loading.value = false;
  }
});
</script>
