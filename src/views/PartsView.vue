<template>
  <div class="min-h-screen bg-white relative flex flex-col">
    <!-- Fixed Header Section -->
    <div class="fixed top-0 left-0 right-0 bg-white z-20">
      <VattenfallHeader title="" />

      <div class="px-[48px] pb-6">
        <PageTitle title="Pick your parts to explore" :show-close="true" close-route="/" />

        <!-- Difficulty Selection with Tabs -->
        <div class="mb-10">
          <div class="flex gap-x-10 relative pb-8">
            <button
              v-for="(level, index) in difficulties"
              :key="level.value"
              :ref="
                (el) => {
                  if (el) difficultyRefs[index] = el as HTMLElement;
                }
              "
              @click="setDifficultyLevel(level.value)"
              :class="[
                'px-[32px] py-[12px] rounded-full font-vattenfall font-medium text-2xl transition-all relative',
                currentDifficulty === level.value
                  ? 'bg-[#2071b5] text-white'
                  : 'bg-[#e5e5e5] text-[#4a4a4a] hover:bg-[#d5d5d5]',
              ]"
            >
              {{ level.label }}
            </button>
            <!-- Active tab indicator line -->
            <div
              class="absolute bottom-0 h-1 bg-[#2071b5] transition-all duration-300"
              :style="tabIndicatorStyle"
            ></div>
          </div>
          <!-- Full width underline -->
          <div class="w-full h-[1px] bg-[#d1d1d6]"></div>
        </div>

        <!-- Instruction text -->
        <div class="mb-[32px]">
          <p class="text-[18px] leading-[1.5] text-black font-vattenfall">
            Select <strong>{{ maxPartsWord }}</strong> part{{
              currentDifficulty === "easy" ? "" : "s"
            }}
            from below to ideate on.
          </p>
          <p class="text-[18px] leading-[1.5] text-black font-vattenfall">
            Feel like challenging yourself? Choose toggle to 'Medium' or 'Difficult' level to choose
            more that one part.
          </p>
        </div>
      </div>
    </div>

    <!-- Spacer to push content below fixed header -->
    <div style="height: 500px"></div>

    <!-- Scrollable Grid container -->
    <div class="px-[48px] pb-[160px]">
      <div class="w-full">
        <div class="parts-grid" data-layout="default">
          <!-- Dynamic parts generation based on data -->
          <div
            v-for="(part, index) in sortedParts"
            :key="part.id"
            :class="[
              `part-${index + 1}`,
              `priority-${part.priority}`,
              'bg-[#F9F9F9] border-[#2071B5] border-solid border-2 transition-all ease-in rounded-xl p-6 cursor-pointer flex flex-col items-center text-center relative min-h-[500px]',
              { selected: isPartSelected(part.id) },
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
            <div
              class="flex flex-col items-center justify-between h-full text-center relative pt-[60px]"
            >
              <!-- Icon/Image -->
              <div class="flex w-80 h-80 mb-6">
                <img :src="part.iconSrc" :alt="part.name" class="w-full h-full object-contain" />
              </div>
              <div class="px-4 flex flex-col">
                <!-- Part Name -->
                <h3 class="text-[#3752a4] font-medium font-vattenfall mb-3 text-3xl">
                  {{ part.name }}
                </h3>

                <!-- Description -->
                <p class="text-[#696977] opacity-70 font-vattenfall leading-relaxed text-xl">
                  {{ part.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Button -->
    <div class="fixed bottom-[48px] left-1/2 -translate-x-1/2 z-30">
      <button
        @click="goToIdeaGeneration"
        :disabled="!isSelectionComplete"
        :class="[
          'px-[80px] py-[24px] rounded-full font-vattenfall text-[28px] leading-[1.35] transition-all border-[1.25px] border-solid',
          isSelectionComplete
            ? 'bg-[#ffda00] border-[#ffda00] text-black hover:bg-[#ffd700]'
            : 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed',
        ]"
      >
        Let's Go!
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
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
const difficultyRefs = ref<(HTMLElement | null)[]>([]);

// Get parts sorted by priority (1 = highest priority first)
const sortedParts = computed(() => getPartsByPriority());

const maxPartsText = computed(() => {
  const maxParts =
    currentDifficulty.value === "easy" ? 1 : currentDifficulty.value === "medium" ? 2 : 3;
  return maxParts === 1 ? "1 part" : `${maxParts} parts`;
});

const maxPartsWord = computed(() => {
  if (currentDifficulty.value === "easy") return "one";
  if (currentDifficulty.value === "medium") return "two";
  return "three";
});

const tabIndicatorStyle = computed(() => {
  const index = difficulties.findIndex((d) => d.value === currentDifficulty.value);
  const button = difficultyRefs.value[index];

  if (!button) {
    return { width: "0px", left: "0px" };
  }

  const width = button.offsetWidth;
  const left = button.offsetLeft;

  return {
    width: `${width}px`,
    left: `${left}px`,
  };
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
