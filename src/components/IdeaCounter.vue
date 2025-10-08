<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex flex-col gap-[24px] text-[#2071b5] w-[367px]">
      <div class="flex gap-[18px] items-center text-[53px] leading-[1.2] font-vattenfall-display font-bold">
        <p>{{ ideaCount }}</p>
        <p>Ideas</p>
      </div>
      <p class="text-[24px] leading-[1.5] font-vattenfall font-medium">
        Scroll to view the ideas shared<br />by participants like you!
      </p>
    </div>
    <PrimaryButton v-if="showButton" label="Click to start Ideating" size="huge" @click="handleClick" />
  </div>
</template>

<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue";
import { useRouter } from "vue-router";

interface Props {
  ideaCount: number;
  showButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  showButton: true
});

const router = useRouter();

const handleClick = () => {
  router.push("/choose");
};
</script>
