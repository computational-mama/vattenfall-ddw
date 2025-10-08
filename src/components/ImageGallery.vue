<template>
  <div class="image-gallery w-full z-30">
    <!-- Create 3 columns with flex -->
    <div class="flex gap-[16px] py-[40px]">
      <!-- Column 1 -->
      <div class="flex flex-col gap-[16px] flex-1">
        <IdeaCard
          v-for="(idea, index) in column1Ideas"
          :key="index"
          :part-name="idea.partName"
          :idea-count="idea.ideaCount"
          :image-url="idea.imageUrl"
          :idea-title="idea.ideaTitle"
          :part-icon="idea.partIcon"
          :tags="idea.tags"
        />
      </div>

      <!-- Column 2 (Middle - with stagger) -->
      <div class="flex flex-col gap-[16px] py-[112px] flex-1">
        <IdeaCard
          v-for="(idea, index) in column2Ideas"
          :key="index"
          :part-name="idea.partName"
          :idea-count="idea.ideaCount"
          :image-url="idea.imageUrl"
          :idea-title="idea.ideaTitle"
          :part-icon="idea.partIcon"
          :tags="idea.tags"
        />
      </div>

      <!-- Column 3 -->
      <div class="flex flex-col gap-[16px] flex-1">
        <IdeaCard
          v-for="(idea, index) in column3Ideas"
          :key="index"
          :part-name="idea.partName"
          :idea-count="idea.ideaCount"
          :image-url="idea.imageUrl"
          :idea-title="idea.ideaTitle"
          :part-icon="idea.partIcon"
          :tags="idea.tags"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IdeaCard from "./IdeaCard.vue";

export interface IdeaData {
  partName: string;
  ideaCount: number;
  imageUrl: string;
  ideaTitle: string;
  partIcon?: string;
  tags?: string[];
}

interface Props {
  ideas: IdeaData[];
  totalIdeas?: number;
}

const props = withDefaults(defineProps<Props>(), {
  totalIdeas: 64,
});

// Split ideas into 3 columns
const column1Ideas = computed(() => props.ideas.filter((_, index) => index % 3 === 0));

const column2Ideas = computed(() => props.ideas.filter((_, index) => index % 3 === 1));

const column3Ideas = computed(() => props.ideas.filter((_, index) => index % 3 === 2));
</script>

<style scoped>
/* Styles handled by Tailwind */
</style>
