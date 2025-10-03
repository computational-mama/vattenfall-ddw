<template>
  <div class="min-h-screen bg-white flex flex-col relative overflow-hidden">
    <!-- Background SVG -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
      <img
        src="../assets/images/bg-closepage.svg"
        alt=""
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Content Container -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Logo -->
      <div class="w-full flex justify-center pt-12 pb-8">
        <VattenfallLogo variant="linear-grey" size="large" />
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col items-center justify-start px-8 pt-8">
        <!-- Thank You Message -->
        <div class="text-center mb-12 max-w-3xl">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-vattenfall">
            Thank you for participating!
          </h1>
          <p class="text-xl md:text-2xl text-gray-700 font-vattenfall">
            Your idea breathes life back into a<br />decommissioned windmill.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            @click="endSession"
            class="px-12 py-4 bg-gray-200 text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-300 transition-colors font-vattenfall"
          >
            End session
          </button>
          <button
            @click="submitAnother"
            class="px-12 py-4 bg-yellow-400 text-gray-900 rounded-full font-semibold text-lg hover:bg-yellow-500 transition-colors font-vattenfall shadow-md"
          >
            Submit another idea
          </button>
        </div>

        <!-- Image Gallery Section -->
        <div class="w-full max-w-7xl pb-16">
          <ImageGallery :ideas="mockIdeas" :total-ideas="totalIdeas" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import VattenfallLogo from '../components/VattenfallLogo.vue'
import ImageGallery from '../components/ImageGallery.vue'
import type { IdeaData } from '../components/ImageGallery.vue'

const router = useRouter()

// Placeholder - will be fetched from Firebase later
const totalIdeas = ref(64)

// Mock data for gallery - will be replaced with Firebase RTDB data
const mockIdeas = ref<IdeaData[]>([
  {
    partName: 'Torque arm shaft',
    ideaCount: 12,
    imageUrl: '/src/assets/images/cad-image-frame.png',
    ideaTitle: 'A Canal Water Harvester',
    partIcon: '/src/assets/images/icon-connection.png'
  },
  {
    partName: 'Torque arm shaft',
    ideaCount: 8,
    imageUrl: '/src/assets/images/cad-image-frame2.png',
    ideaTitle: 'Sustainable Energy Hub',
    partIcon: '/src/assets/images/icon-connection.png'
  },
  {
    partName: 'Blade Assembly',
    ideaCount: 23,
    imageUrl: '/src/assets/images/cad-image-frame.png',
    ideaTitle: 'Modern Art Installation',
    partIcon: '/src/assets/images/icon-plant.png'
  },
  {
    partName: 'Generator Housing',
    ideaCount: 15,
    imageUrl: '/src/assets/images/cad-image-frame2.png',
    ideaTitle: 'Community Greenhouse',
    partIcon: '/src/assets/images/icon-connection.png'
  },
  {
    partName: 'Nacelle',
    ideaCount: 19,
    imageUrl: '/src/assets/images/cad-image-frame.png',
    ideaTitle: 'Observation Deck',
    partIcon: '/src/assets/images/icon-plant.png'
  },
  {
    partName: 'Tower Section',
    ideaCount: 11,
    imageUrl: '/src/assets/images/cad-image-frame2.png',
    ideaTitle: 'Vertical Garden System',
    partIcon: '/src/assets/images/icon-connection.png'
  }
])

const endSession = () => {
  // Navigate to welcome page
  router.push('/')
}

const submitAnother = () => {
  // Navigate to parts selection
  router.push('/choose')
}
</script>

<style scoped>
/* Additional styling if needed */
</style>
