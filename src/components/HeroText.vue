<template>
  <div class="relative w-full flex items-center justify-center">
    <h1
      class="font-vattenfall-display font-bold text-5xl md:text-6xl lg:text-7xl text-center leading-tight text-neutral-950"
    >
      What if a wind mill's <span :class="highlightColorClass">{{ highlightText }}</span> could be
      re-used
      <span v-if="additionalText">
        <span :class="secondaryColorClass">{{ additionalText }}</span></span
      >{{ ending }}
    </h1>
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
