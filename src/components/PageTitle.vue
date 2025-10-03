<template>
  <div class="text-center mb-12">
    <h1 class="text-[56px] font-bold text-[#1d1d1d] leading-tight font-vattenfall-display">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
