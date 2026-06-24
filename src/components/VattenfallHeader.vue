<template>
  <div class="bg-white kiosk:px-8 kiosk:py-6">
    <header class="">
      <!-- Vattenfall Logo -->
      <div class="flex items-center justify-between">
        <img
          src="/src/assets/logos/VF_logo_linear_grey_RGB.png"
          alt="Vattenfall"
          class="h-12 w-auto"
        />
        <p class="text-xs text-gray-400 px-5">Built by Studio WIP</p>
        <!-- <img src="/src/assets/logos/logowip.png" alt="Vattenfall" class="h-5 w-auto ml-3" /> -->
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
