<template>
  <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
    <!-- Image -->
    <div class="mb-6">
      <img :src="imageSrc" :alt="title" class="w-full h-auto object-contain" />
    </div>

    <!-- Title -->
    <h3 class="text-2xl font-vattenfall font-semibold text-[#3752a4] mb-2 text-center">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-base font-vattenfall text-gray-600 text-center leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageSrc: string
  title: string
  description: string
}

defineProps<Props>()
</script>
