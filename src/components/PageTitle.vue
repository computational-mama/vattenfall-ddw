<template>
  <div class="flex items-start justify-between mb-4 md:mb-8 kiosk:mb-[48px]">
    <h1 class="text-2xl md:text-4xl kiosk:text-[53px] leading-[1.2] font-vattenfall-display font-bold text-black">
      {{ title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

interface Props {
  title: string;
  showClose?: boolean;
  closeRoute?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showClose: false,
  closeRoute: "/",
});

const router = useRouter();

const handleClose = () => {
  router.push(props.closeRoute);
};
</script>
