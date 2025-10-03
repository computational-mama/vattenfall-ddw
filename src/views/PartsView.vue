<template>
  <div class="min-h-screen bg-white">
    <VattenfallHeader title="" />

    <div class="px-8 pb-12">
      <PageTitle title="Select Complexity:" />

      <!-- Difficulty Selection -->
      <div class="flex justify-center gap-4 mb-12 mt-8">
        <button
          v-for="level in difficulties"
          :key="level.value"
          @click="setDifficultyLevel(level.value)"
          :class="[
            'px-8 py-4 rounded-full font-vattenfall font-medium text-xl transition-all',
            currentDifficulty === level.value
              ? 'bg-[#396fb0] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          ]"
        >
          {{ level.label }}
        </button>
      </div>

      <!-- Instruction text -->
      <p class="text-center text-gray-500 mb-8 text-lg font-vattenfall">
        Choose {{ maxPartsText }} and reimagine their usage.
      </p>

      <!-- Grid container -->
      <div class="w-full">
        <div class="parts-grid" data-layout="default">
          <!-- Dynamic parts generation based on data -->
          <div
            v-for="(part, index) in sortedParts"
            :key="part.id"
            :class="[
              `part-${index + 1}`,
              `priority-${part.priority}`,
              'rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center text-center',
              { selected: isPartSelected(part.id) },
            ]"
            @click="togglePart(part)"
          >
            <!-- Show arrow icon for priority 1 and 2 parts -->
            <!-- <div v-if="part.priority <= 2" class="absolute top-6 right-6 w-6 h-6">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                class="w-full h-full text-gray-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="m7 7 10 10M7 17 17 7"
                ></path>
              </svg>
            </div> -->

            <!-- Part content -->
            <div class="flex flex-col items-center justify-center h-full text-center relative">
              <!-- Icon/Image -->
              <div
                :class="[
                  'mb-4 flex items-center justify-center',
                  part.priority === 1
                    ? 'w-24 h-24'
                    : part.priority === 2
                      ? 'w-20 h-20'
                      : part.priority === 3
                        ? 'w-16 h-16'
                        : 'w-12 h-12',
                ]"
              >
                <img :src="part.iconSrc" :alt="part.name" class="w-full h-full object-contain" />
              </div>

              <!-- Part Name -->
              <h3 :class="['text-[#3752a4] font-medium font-vattenfall mb-3 text-3xl']">
                {{ part.name }}
              </h3>

              <!-- Description (shown for priority 1-3) -->
              <p
                v-if="part.priority <= 3"
                :class="['text-[#696977] opacity-70 font-vattenfall leading-relaxed text-xl']"
              >
                {{ part.description }}
              </p>

              <!-- Tags (shown only for priority 1) -->
              <div
                v-if="part.priority === 1 && part.tags"
                class="flex flex-wrap gap-2 mt-4 justify-center"
              >
                <span
                  v-for="tag in part.tags.slice(0, 3)"
                  :key="tag"
                  class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-md font-vattenfall font-light"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NavigationFooter>
      <NavigationButtons
        :show-back="false"
        next-text="Next"
        :disable-next="!isSelectionComplete"
        @next="goToIdeaGeneration"
      />
    </NavigationFooter>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
import NavigationFooter from "../components/NavigationFooter.vue";
import NavigationButtons from "../components/NavigationButtons.vue";
import { useSelectedPart, type Difficulty } from "../composables/useSelectedPart";
import { partsData, getPartsByPriority, type PartData } from "../data/partsData";

const router = useRouter();
const { addSelectedPart, getSelectedParts, setDifficulty, getDifficulty } = useSelectedPart();

// Difficulty levels
const difficulties = [
  { label: "Easy", value: "easy" as Difficulty },
  { label: "Medium", value: "medium" as Difficulty },
  { label: "Difficult", value: "difficult" as Difficulty },
];

const currentDifficulty = ref<Difficulty>(getDifficulty());
const selectedPartIds = ref<string[]>([]);

// Get parts sorted by priority (1 = highest priority first)
const sortedParts = computed(() => getPartsByPriority());

const maxPartsText = computed(() => {
  const maxParts =
    currentDifficulty.value === "easy" ? 1 : currentDifficulty.value === "medium" ? 2 : 3;
  return maxParts === 1 ? "1 part" : `${maxParts} parts`;
});

const isSelectionComplete = computed(() => {
  const requiredParts =
    currentDifficulty.value === "easy" ? 1 : currentDifficulty.value === "medium" ? 2 : 3;
  return selectedPartIds.value.length === requiredParts;
});

const setDifficultyLevel = (level: Difficulty) => {
  currentDifficulty.value = level;
  setDifficulty(level);
  // Update selected part IDs based on current selections
  selectedPartIds.value = getSelectedParts().map((p) => p.id);
};

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
  if (selectedParts.length === 0) {
    // Auto-select first part(s) if none selected
    const maxParts =
      currentDifficulty.value === "easy" ? 1 : currentDifficulty.value === "medium" ? 2 : 3;
    for (let i = 0; i < maxParts && i < sortedParts.value.length; i++) {
      addSelectedPart(sortedParts.value[i]);
    }
  }
  router.push("/idea-generation");
};
</script>
