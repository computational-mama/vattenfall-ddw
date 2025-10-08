<template>
  <div class="bg-[#F9F9F9] rounded-2xl overflow-hidden transition-shadow">
    <!-- Image -->
    <div class="relative aspect-square p-6">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="ideaTitle"
        class="w-full h-full object-contain rounded-md"
        @error="onImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400"></div>
    </div>

    <!-- Header: Part Name & Idea Count -->
    <div class="flex items-center justify-baseline gap-3">
      <div class="flex-1 px-6 pb-6">
        <h3 class="text-xl capitalize font-semibold text-[#2071b5] font-vattenfall">
          {{ partName }}
        </h3>
      </div>
    </div>

    <!-- Idea Title -->
    <div class="px-6 pb-4">
      <p class="text-sm font-medium text-gray-700 font-vattenfall">{{ ideaTitle }}</p>
    </div>

    <!-- Tags -->
    <div v-if="tags && tags.length > 0" class="px-6 pb-6 flex gap-[12px] flex-wrap">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="px-3 py-1.5 bg-[#e8f2f7] text-[#2071b5] rounded-full text-[11px] font-vattenfall border border-[#2071b5]"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  partName: string;
  ideaCount: number;
  imageUrl: string;
  ideaTitle: string;
  partIcon?: string;
  tags?: string[];
}

const props = defineProps<Props>();

const imageError = ref(false);

const onImageError = () => {
  imageError.value = true;
};
</script>

<style scoped></style>
