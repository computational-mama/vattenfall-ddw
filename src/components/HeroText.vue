<template>
  <div
    class="flex flex-col gap-[10px] items-center text-center font-vattenfall-display font-bold w-full"
  >
    <div class="flex flex-col gap-[64px] items-center text-black w-full">
      <p class="text-[28px] leading-[1.3] m-0">What if a</p>
      <div class="text-[72px] leading-[1.16] w-full">
        <p class="m-0">Wind turbine's {{ highlightText }}</p>
        <p class="m-0">could be re-used as a</p>
      </div>
    </div>
    <p class="text-[#2071b5] text-[72px] leading-[1.16] m-0">
      {{ additionalText || ending }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  highlightText: string;
  highlightColor?: "yellow" | "blue";
  additionalText?: string;
  secondaryColor?: "yellow" | "blue";
  ending?: string;
}

const props = withDefaults(defineProps<Props>(), {
  highlightColor: "yellow",
  secondaryColor: "blue",
  ending: "...",
});

const highlightColorClass = computed(() => {
  return props.highlightColor === "yellow" ? "text-[#ffda00]" : "text-[#396fb0]";
});

const secondaryColorClass = computed(() => {
  return props.secondaryColor === "yellow" ? "text-[#ffda00]" : "text-[#396fb0]";
});
</script>
