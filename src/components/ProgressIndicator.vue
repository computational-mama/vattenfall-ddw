<template>
  <div class="flex gap-[16px] items-center w-full">
    <div
      v-for="step in totalSteps"
      :key="step"
      class="h-[12px] rounded-[99999px] transition-all duration-500 flex-1 relative overflow-hidden"
      :class="[
        step === currentStep ? 'bg-[#edf1f6]' : 'bg-[#edf1f6]'
      ]"
    >
      <div
        v-if="step === currentStep"
        class="absolute left-0 top-0 h-full bg-[#2071b5] rounded-[99999px]"
        :style="{ width: '130px' }"
      />
    </div>
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
