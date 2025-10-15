<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#2071b5]"
      ></div>
      <p class="mt-6 text-xl text-[#2071b5] font-vattenfall">Loading ideas...</p>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-white border-b-1 border-[#B5B5B5]">
      <VattenfallHeader title="" />

      <div class="px-[48px] pb-6">
        <PageTitle title="All Ideas" :show-close="true" close-route="/" />

        <!-- Subtitle -->
        <div class="flex items-center justify-between -mt-6">
          <p class="text-lg leading-[1.5] text-black font-vattenfall">
            Browse all the creative ideas submitted by visitors
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="px-[48px] pb-12">
      <!-- Idea Counter Section -->
      <div class="w-full py-8">
        <IdeaCounter :idea-count="totalIdeas" :show-button="false" />
      </div>

      <!-- Grouped by Date -->
      <div v-if="groupedIdeas.length > 0" class="w-full pb-16 space-y-12">
        <div v-for="group in groupedIdeas" :key="group.date" class="w-full">
          <!-- Date Header -->
          <div class="mb-6">
            <h2 class="text-3xl font-bold font-vattenfall text-[#2071b5]">{{ group.label }}</h2>
            <p class="text-md text-gray-600 font-vattenfall">{{ group.ideas.length }} ideas</p>
          </div>

          <!-- Gallery for this date -->
          <ImageGallery :ideas="group.ideas" :total-ideas="group.ideas.length" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <p class="text-xl text-gray-500 font-vattenfall">No ideas yet. Be the first to submit one!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
import ImageGallery from "../components/ImageGallery.vue";
import IdeaCounter from "../components/IdeaCounter.vue";
import type { IdeaData } from "../components/ImageGallery.vue";
import { useFirebaseData } from "../composables/useFirebaseData";

const router = useRouter();
const { fetchAllConversations } = useFirebaseData();

// Loading state
const isLoading = ref(true);

// Data refs
const allConversations = ref<any[]>([]);
const totalIdeas = ref(0);

// Load data on mount
onMounted(async () => {
  try {
    const conversations = await fetchAllConversations();

    // Filter to only show conversations with image URLs
    allConversations.value = conversations.filter((conv) => conv.image_url);
    totalIdeas.value = conversations.length;
  } catch (error) {
    console.error("Error loading conversations:", error);
  } finally {
    isLoading.value = false;
  }
});

// Helper function to format date labels
const getDateLabel = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare dates only
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Today";
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Yesterday";
  } else {
    // Format as "Month Day, Year" (e.g., "October 15, 2025")
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
};

// Helper function to get date key for grouping
const getDateKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

// Computed property for grouped ideas by date
const groupedIdeas = computed(() => {
  if (!allConversations.value.length) return [];

  // Group conversations by date
  const groups = new Map<string, any[]>();

  allConversations.value.forEach((conv) => {
    const dateKey = getDateKey(conv.timestamp || Date.now());
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(conv);
  });

  // Convert to array and sort by date (newest first)
  const groupedArray = Array.from(groups.entries()).map(([dateKey, conversations]) => {
    const timestamp = conversations[0].timestamp || Date.now();
    return {
      date: dateKey,
      timestamp,
      label: getDateLabel(timestamp),
      ideas: conversations.map((conv) => ({
        partName: conv.key_phrases?.[0] || "",
        ideaCount: conv.key_phrases?.length || 0,
        imageUrl: conv.image_url || "",
        ideaTitle: conv.summary || "",
        partIcon: "",
        tags: conv.key_phrases || [],
      })) as IdeaData[],
    };
  });

  // Sort groups by timestamp (newest first)
  groupedArray.sort((a, b) => b.timestamp - a.timestamp);

  return groupedArray;
});
</script>

<style scoped>
/* Additional styling if needed */
</style>
