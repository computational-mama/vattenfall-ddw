<template>
  <div class="flex items-center justify-around w-full px-8 gap-8">
    <p class="text-[#396fb0] text-4xl md:text-5xl font-vattenfall font-medium leading-snug">
      {{ ideaCount }} ideas shared by<br />participants like you!
    </p>
    <PrimaryButton label="Click to start ideating!" size="medium" @click="handleClick" />
  </div>
</template>

<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue";
import { useRouter } from "vue-router";

interface Props {
  ideaCount: number;
}

defineProps<Props>();

const router = useRouter();

const handleClick = () => {
  router.push("/choose");
};
</script>
