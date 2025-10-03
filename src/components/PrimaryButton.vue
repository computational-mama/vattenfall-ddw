<template>
  <button
    class="bg-[#ffda00] text-neutral-950 font-medium rounded-full px-8 py-6 hover:bg-[#ffd700] transition-colors duration-200"
    :class="sizeClass"
    @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium'
})

defineEmits<{
  click: []
}>()

const sizeClass = computed(() => {
  const sizes = {
    small: 'text-base px-6 py-4',
    medium: 'text-xl px-8 py-6',
    large: 'text-2xl px-10 py-7'
  }
  return sizes[props.size]
})
</script>
