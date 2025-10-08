<template>
  <div class="flex items-start justify-between mb-[48px]">
    <h1 class="text-[48px] leading-[1.2] font-vattenfall-display font-bold text-black">
      {{ title }}
    </h1>
    <button
      v-if="showClose"
      @click="handleClose"
      class="w-[72px] h-[72px] flex items-center justify-center rounded-full hover:bg-gray-100 bg-[#f5f5f5] transition-colors"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  title: string;
  showClose?: boolean;
  closeRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showClose: false,
  closeRoute: '/'
});

const router = useRouter();

const handleClose = () => {
  router.push(props.closeRoute);
};
</script>
