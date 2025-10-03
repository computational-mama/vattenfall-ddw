<template>
  <div
    :class="[
      'rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all',
      selected
        ? 'border-2 border-blue-600 shadow-lg bg-white'
        : 'border border-gray-200 bg-white hover:border-gray-300',
    ]"
    @click="$emit('select')"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2">
        <img :src="iconSrc" :alt="iconAlt" class="w-full h-full object-contain" />
      </div>
      <div class="w-5 h-5">
        <svg
          class="w-full h-full text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="m7 7 10 10M7 17l10-10"
          />
        </svg>
      </div>
    </div>

    <h3 :class="['text-2xl font-semibold mb-1', selected ? 'text-blue-600' : 'text-gray-800']">
      {{ title }}
    </h3>
    <p class="text-gray-500 text-lg leading-relaxed">
      {{ description }}
    </p>

    <!-- Optional image slot -->
    <div v-if="$slots.image" class="mt-6 flex justify-center">
      <slot name="image"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt?: string;
  selected?: boolean;
}

interface Emits {
  select: [];
}

withDefaults(defineProps<Props>(), {
  iconAlt: "Icon",
  selected: false,
});

defineEmits<Emits>();
</script>
