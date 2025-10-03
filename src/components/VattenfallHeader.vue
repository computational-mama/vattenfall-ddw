<template>
  <div class="bg-white px-8 py-6">
    <header class="flex items-center justify-between">
      <!-- Vattenfall Logo -->
      <div class="flex items-center">
        <img src="/src/assets/logos/vattenfall-logo.png" alt="Vattenfall" class="h-18 w-auto" />
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
