<template>
  <button
    @click="$emit('click')"
    class="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-white border-2 border-[#d1d1d6] hover:border-[#2071b5] transition-all"
  >
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
<script setup lang="ts">
// import { computed } from "vue";
defineEmits<{
  click: [];
}>();
</script>
