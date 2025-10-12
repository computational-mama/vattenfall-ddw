<template>
  <div class="min-h-screen bg-white relative flex flex-col">
    <!-- Fixed Header Section -->
    <div class="fixed top-0 left-0 right-0 bg-white z-20">
      <VattenfallHeader title="" />

      <div class="px-[48px] pb-6">
        <PageTitle title="Select upto three parts to explore" :show-close="true" close-route="/" />
        <!-- Instruction text -->
        <div class="mb-[32px]">
          <h3 class="text-2xl leading-[1.5] text-black font-vattenfall font-bold">
            More parts, higher complexity
          </h3>

          <p class="text-[18px] leading-[1.5] text-black font-vattenfall">
            Feel like challenging yourself? Choose more than one part.
          </p>
        </div>
        <!-- Progress Indicator -->
        <div class="mb-10">
          <div class="flex items-center gap-4 mb-4">
            <p
              v-if="selectedPartIds.length > 0"
              class="text-[18px] leading-[1.5] text-black font-vattenfall font-black"
            >
              {{
                selectedPartIds.length === 1
                  ? "Easy"
                  : selectedPartIds.length === 2
                    ? "Medium"
                    : "Difficult"
              }}
            </p>

            <p class="text-[18px] leading-[1.5] text-black font-vattenfall">
              <strong>{{ selectedPartIds.length }}</strong> parts selected
            </p>
          </div>
          <!-- Progress bar -->
          <div class="w-full h-2 bg-[#e5e5e5] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#2071b5] transition-all duration-500 ease-out"
              :style="{ width: `${(selectedPartIds.length / 3) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Spacer to push content below fixed header -->
    <div style="height: 450px"></div>

    <!-- Scrollable Grid container -->
    <div class="px-[24px] pb-[160px]">
      <div class="w-full">
        <div class="flex gap-4 w-full mb-[100px]">
          <!-- Column 1 -->
          <div class="flex flex-col gap-4 flex-1">
            <div
              v-for="(part, index) in sortedParts.filter((_, i) => i % 3 === 0)"
              :key="part.id"
              :class="[
                'bg-[#F9F9F9] border-[#2071B5] border-2 rounded-xl p-4 cursor-pointer transition-all',
                'flex flex-col items-center justify-center relative',

                {
                  'bg-[rgba(57,111,176,0.15)] border-[#396fb0] border-4 shadow-lg scale-[1.02]':
                    isPartSelected(part.id),
                },
              ]"
              @click="togglePart(part)"
            >
              <!-- Selection checkmark icon - top right -->
              <div
                v-if="isPartSelected(part.id)"
                class="absolute top-[16px] right-[16px] w-[40px] h-[40px] bg-[#4caf50] rounded-full flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="3"
                >
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <!-- Unselected circle icon - top right -->
              <div
                v-else
                class="absolute top-[16px] right-[16px] w-[40px] h-[40px] border-[2px] border-[#d1d1d6] rounded-full"
              ></div>

              <!-- Part content -->
              <div class="flex flex-col items-center text-center pt-[40px] w-full">
                <!-- Icon/Image -->
                <div
                  :class="part.priority === 1 ? 'w-72 h-72' : 'w-48 h-48'"
                  class="mb-4 flex-shrink-0"
                >
                  <img :src="part.iconSrc" :alt="part.name" class="w-full h-full object-cover" />
                </div>
                <div class="px-2 flex flex-col">
                  <!-- Part Name -->
                  <h3 class="text-[#3752a4] font-medium font-vattenfall mb-2 text-xl">
                    {{ part.name }}
                  </h3>

                  <!-- Description -->
                  <p class="text-[#696977] opacity-70 font-vattenfall leading-relaxed text-sm pb-4">
                    {{ part.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 2 -->
          <div class="flex flex-col gap-4 flex-1">
            <div
              v-for="(part, index) in sortedParts.filter((_, i) => i % 3 === 1)"
              :key="part.id"
              :class="[
                'bg-[#F9F9F9] border-[#2071B5] border-2 rounded-xl p-4 cursor-pointer transition-all',
                'flex flex-col items-center justify-center relative',
                {
                  'bg-[rgba(57,111,176,0.15)] border-[#396fb0] border-4 shadow-lg scale-[1.02]':
                    isPartSelected(part.id),
                },
              ]"
              @click="togglePart(part)"
            >
              <!-- Selection checkmark icon - top right -->
              <div
                v-if="isPartSelected(part.id)"
                class="absolute top-[16px] right-[16px] w-[40px] h-[40px] bg-[#4caf50] rounded-full flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="3"
                >
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <!-- Unselected circle icon - top right -->
              <div
                v-else
                class="absolute top-[16px] right-[16px] w-[40px] h-[40px] border-[2px] border-[#d1d1d6] rounded-full"
              ></div>

              <!-- Part content -->
              <div class="flex flex-col items-center text-center pt-[40px] w-full">
                <!-- Icon/Image -->
                <div
                  :class="part.priority === 1 ? 'w-72 h-72' : 'w-48 h-48'"
                  class="mb-4 flex-shrink-0"
                >
                  <img :src="part.iconSrc" :alt="part.name" class="w-full h-full object-contain" />
                </div>
                <div class="px-2 flex flex-col">
                  <!-- Part Name -->
                  <h3 class="text-[#3752a4] font-medium font-vattenfall mb-2 text-xl">
                    {{ part.name }}
                  </h3>

                  <!-- Description -->
                  <p class="text-[#696977] opacity-70 font-vattenfall leading-relaxed text-sm pb-4">
                    {{ part.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 3 -->
          <div class="flex flex-col gap-4 flex-1">
            <div
              v-for="(part, index) in sortedParts.filter((_, i) => i % 3 === 2)"
              :key="part.id"
              :class="[
                'bg-[#F9F9F9] border-[#2071B5] border-2 rounded-xl p-4 cursor-pointer transition-all',
                'flex flex-col items-center justify-center relative',
                {
                  'bg-[rgba(57,111,176,0.15)] border-[#396fb0] border-4 shadow-lg scale-[1.02]':
                    isPartSelected(part.id),
                },
              ]"
              @click="togglePart(part)"
            >
              <!-- Selection checkmark icon - top right -->

              <div
                v-if="isPartSelected(part.id)"
                class="absolute top-[16px] right-[16px] w-[40px] h-[40px] bg-[#4caf50] rounded-full flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="3"
                >
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <!-- Unselected circle icon - top right -->
              <div
                v-else
                class="absolute top-[16px] right-[16px] w-[40px] h-[40px] border-[2px] border-[#d1d1d6] rounded-full"
              ></div>

              <!-- Part content -->
              <div class="flex flex-col items-center text-center pt-[40px] w-full">
                <!-- Icon/Image -->
                <div
                  :class="part.priority === 1 ? 'w-72 h-72' : 'w-48 h-48'"
                  class="mb-4 flex-shrink-0"
                >
                  <img :src="part.iconSrc" :alt="part.name" class="w-full h-full object-contain" />
                </div>
                <div class="px-2 flex flex-col">
                  <!-- Part Name -->
                  <h3 class="text-[#3752a4] font-medium font-vattenfall mb-2 text-xl">
                    {{ part.name }}
                  </h3>

                  <!-- Description -->
                  <p class="text-[#696977] opacity-70 font-vattenfall leading-relaxed text-sm pb-4">
                    {{ part.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Footer -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e5e5] z-30">
      <div class="flex items-center justify-between px-[48px] py-[32px] max-w-[1400px] mx-auto">
        <!-- Back Button -->
        <BackButton @click="backButton" />

        <!-- Selected Parts Preview -->
        <div class="flex-1 flex items-center justify-center gap-4 px-8">
          <template v-if="selectedPartIds.length > 0">
            <div
              v-for="(part, index) in getSelectedParts()"
              :key="part.id"
              class="relative bg-white border-2 border-[#2071b5] rounded-lg p-4 w-[120px] h-[120px] flex items-center justify-center"
            >
              <img :src="part.iconSrc" :alt="part.name" class="w-full h-full object-contain" />
              <!-- Count Badge -->
              <div
                class="absolute -top-2 -right-2 w-[40px] h-[40px] bg-[#4caf50] rounded-full flex items-center justify-center text-white font-vattenfall font-bold text-lg"
              >
                {{ index + 1 }}
              </div>
            </div>
          </template>
          <template v-else>
            <p class="text-[#696977] font-vattenfall text-xl">No part selected.</p>
          </template>
        </div>

        <!-- Let's Go Button -->
        <PrimaryButton
          label="Let's Go!"
          size="huge"
          :disabled="!isSelectionComplete"
          @click="goToIdeaGeneration"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import BackButton from "@/components/BackButton.vue";
import { useSelectedPart, type Difficulty } from "../composables/useSelectedPart";
import { partsData, getPartsByPriority, type PartData } from "../data/partsData";
import { useInactivityTimeout } from "../composables/useInactivityTimeout";

const router = useRouter();
const { addSelectedPart, getSelectedParts, clearSelectedParts } = useSelectedPart();

// Inactivity timeout - 90 seconds
useInactivityTimeout({
  timeoutSeconds: 90,
  redirectTo: "/",
  onTimeout: () => {
    clearSelectedParts();
  },
});

const MAX_PARTS = 3;
const selectedPartIds = ref<string[]>([]);

// Initialize when mounting
onMounted(() => {
  // Get current selected parts from global state
  selectedPartIds.value = getSelectedParts().map((p) => p.id);
});

// Get parts in original CSV order (not sorted by priority)
const sortedParts = computed(() => partsData);

const isSelectionComplete = computed(() => {
  return selectedPartIds.value.length >= 1 && selectedPartIds.value.length <= MAX_PARTS;
});

const isPartSelected = (partId: string) => {
  return selectedPartIds.value.includes(partId);
};

const togglePart = (part: PartData) => {
  addSelectedPart(part);
  selectedPartIds.value = getSelectedParts().map((p) => p.id);
  console.log(
    "Selected parts:",
    getSelectedParts().map((p) => p.name),
  );
};

const goToIdeaGeneration = () => {
  const selectedParts = getSelectedParts();
  if (selectedParts.length > 0) {
    router.push("/idea-generation");
  }
};
const backButton = () => {
  router.push("/");
};
</script>
