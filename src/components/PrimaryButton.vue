<template>
  <button
    :disabled="disabled"
    :class="[
      'font-vattenfall font-regular rounded-full transition-colors duration-200',
      sizeClass,
      variantClass,
      disabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
    @click="$emit('click')"
  >
    <svg
      v-if="iconPosition === 'left'"
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    {{ label }}
    <svg
      v-if="iconPosition === 'right'"
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label: string;
  size?: "small" | "medium" | "large" | "huge";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  iconPosition?: "left" | "right" | "none";
}

const props = withDefaults(defineProps<Props>(), {
  size: "medium",
  variant: "primary",
  disabled: false,
  iconPosition: "none",
});

defineEmits<{
  click: [];
}>();

const sizeClass = computed(() => {
  const sizes = {
    small: "text-base px-6 py-4",
    medium: "text-xl px-8 py-6",
    large: "text-2xl px-10 py-7",
    huge: "text-[28px] px-[140px] py-[24px] h-[90px]",
  };
  return sizes[props.size];
});

const variantClass = computed(() => {
  if (props.disabled) {
    return "bg-[#e5e5e5] text-[#a0a0a0] cursor-not-allowed";
  }

  const variants = {
    primary:
      "font-vattenfall bg-[#ffda00] text-black border-[1.25px] border-solid border-[#ffda00]",
    secondary: "font-vattenfall border-1 border-[#2071B5] text-[#2071B5]",
  };
  return variants[props.variant];
});
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
