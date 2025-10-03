<template>
  <div class="image-gallery w-full">
    <!-- Gallery Header -->
    <div class="mb-8">
      <p class="text-xl font-vattenfall font-medium" style="color: #6496D3">
        Scroll through {{ totalIdeas }} Ideas shared<br />by participants like you!
      </p>
    </div>

    <!-- Masonry Grid -->
    <div class="gallery-grid">
      <IdeaCard
        v-for="(idea, index) in ideas"
        :key="index"
        :part-name="idea.partName"
        :idea-count="idea.ideaCount"
        :image-url="idea.imageUrl"
        :idea-title="idea.ideaTitle"
        :part-icon="idea.partIcon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IdeaCard from './IdeaCard.vue'

export interface IdeaData {
  partName: string
  ideaCount: number
  imageUrl: string
  ideaTitle: string
  partIcon?: string
}

interface Props {
  ideas: IdeaData[]
  totalIdeas?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalIdeas: 64
})

// Can be used for future filtering/sorting
const displayedIdeas = computed(() => props.ideas)
</script>

<style scoped>
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
