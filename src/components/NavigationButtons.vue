<template>
  <div class="flex justify-between items-center w-full max-w-4xl">
    <PrimaryButton
      v-if="showBack"
      :label="backText"
      variant="secondary"
      icon-position="left"
      @click="onBack"
    />
    <div v-else></div>

    <PrimaryButton
      :label="nextText"
      variant="primary"
      icon-position="right"
      :disabled="disableNext"
      @click="onNext"
    />
  </div>
</template>

<script setup lang="ts">
import PrimaryButton from './PrimaryButton.vue'

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