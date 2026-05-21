<template>
  <div class="image-gallery w-full z-30">
    <div class="grid grid-cols-1 md:grid-cols-2 kiosk:grid-cols-3 gap-4 py-6 kiosk:py-[40px]">
      <IdeaCard
        v-for="(idea, index) in ideas"
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
</template>

<script setup lang="ts">
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

withDefaults(defineProps<Props>(), {
  totalIdeas: 64,
});
</script>

<style scoped>
/* Styles handled by Tailwind */
</style>
