<template>
  <div class="bg-white rounded-xl p-8 border-[1.5px] border-[#d1d1d6]">
    <!-- Image -->
    <div
      v-if="imageSrc"
      class="mb-6 bg-[#f5f5f5] rounded-lg flex items-center justify-center p-8 h-[300px]"
    >
      <img :src="imageSrc" :alt="title" class="max-w-full max-h-full object-contain" />
    </div>

    <!-- Title -->
    <h3
      v-if="title"
      class="text-[20px] leading-[1.3] font-vattenfall font-semibold text-[#2071b5] mb-2"
    >
      {{ title }}
    </h3>

    <!-- Part Label -->
    <p class="text-[14px] leading-[1.5] text-gray-600 font-vattenfall mb-3">Part: Lorem Ipsum</p>

    <!-- Description -->
    <p v-if="description" class="text-[14px] leading-[1.5] font-vattenfall text-gray-600 mb-4">
      {{ description }}
    </p>

    <!-- Tags -->
    <div class="flex gap-2">
      <span class="px-3 py-1 bg-[#e8f2f7] text-[#2071b5] rounded-full text-xs font-vattenfall">
        Label Text
      </span>
      <span class="px-3 py-1 bg-[#e8f2f7] text-[#2071b5] rounded-full text-xs font-vattenfall">
        Label Text
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageSrc: string;
  title: string;
  description: string;
}

defineProps<Props>();
</script>
