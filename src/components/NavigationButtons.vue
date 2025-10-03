<template>
  <div class="flex justify-between items-center w-full max-w-4xl">
    <button
      v-if="showBack"
      @click="onBack"
      class="flex items-center gap-3 px-8 py-4 bg-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-400 transition-colors"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {{ backText }}
    </button>
    <div v-else></div>

    <button
      @click="onNext"
      :disabled="disableNext"
      :class="[
        'flex items-center gap-3 px-12 py-4 rounded-xl font-semibold transition-colors shadow-lg',
        disableNext
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
          : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
      ]"
    >
      {{ nextText }}
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showBack?: boolean
  backText?: string
  nextText?: string
  disableNext?: boolean
}

interface Emits {
  back: []
  next: []
}

withDefaults(defineProps<Props>(), {
  showBack: true,
  backText: 'Back',
  nextText: 'Next',
  disableNext: false
})

const emit = defineEmits<Emits>()

const onBack = () => {
  emit('back')
}

const onNext = () => {
  emit('next')
}
</script>