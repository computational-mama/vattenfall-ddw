<template>
  <div class="flex items-center justify-center">
    <img
      :src="logoSrc"
      alt="Vattenfall"
      :class="sizeClass"
      class="object-contain"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'linear-grey'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'default'
})

const logoSrc = computed(() => {
  if (props.variant === 'linear-grey') {
    return '/src/assets/images/f4c0d3dd857761e726112ac29791872e197708e3.png'
  }
  return '/src/assets/logos/vattenfall-logo.png'
})

const sizeClass = computed(() => {
  const sizes = {
    small: 'h-16 w-auto',
    medium: 'h-24 w-auto',
    large: 'h-32 w-auto'
  }
  return sizes[props.size]
})
</script>
