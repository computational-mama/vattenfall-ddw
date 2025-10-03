<template>
  <div class="flex gap-3 items-center w-full">
    <div
      v-for="step in totalSteps"
      :key="step"
      class="h-2 rounded-full transition-opacity duration-500 flex-1"
      :class="[
        step === currentStep ? 'bg-[#396fb0] opacity-100' : 'bg-[#396fb0] opacity-17'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number
  totalSteps?: number
}

withDefaults(defineProps<Props>(), {
  totalSteps: 3
})
</script>
