<template>
  <div class="bg-white px-8 py-6">
    <header class="flex items-center justify-between">
      <!-- Vattenfall Logo -->
      <div class="flex items-center">
        <img
          src="/src/assets/logos/VF_logo_linear_grey_RGB.png"
          alt="Vattenfall"
          class="h-18 w-auto"
        />
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>
