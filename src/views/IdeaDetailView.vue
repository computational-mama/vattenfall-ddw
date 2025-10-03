<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Logo -->
    <div class="w-full flex justify-center pt-4 md:pt-8 pb-4 md:pb-6">
      <VattenfallLogo variant="linear-grey" size="medium" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center px-4">
      <p class="text-lg md:text-xl text-gray-600 font-vattenfall">Loading idea...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !ideaData" class="flex-1 flex flex-col items-center justify-center px-4 md:px-8">
      <h1 class="text-2xl md:text-4xl font-bold text-gray-900 mb-4 font-vattenfall text-center">Idea Not Found</h1>
      <p class="text-base md:text-xl text-gray-600 mb-8 font-vattenfall text-center">This idea doesn't exist or has been removed.</p>
      <PrimaryButton label="Go to Home" @click="goHome" />
    </div>

    <!-- Idea Content -->
    <div v-else class="flex-1 flex flex-col items-center px-4 md:px-8 pb-8 md:pb-16">
      <div class="max-w-6xl w-full">
        <!-- Mobile Portrait Layout -->
        <div class="block lg:hidden">
          <!-- Main Image -->
          <div class="mb-6">
            <img
              :src="ideaData.image_url"
              :alt="ideaData.summary"
              class="w-full h-auto rounded-xl md:rounded-2xl shadow-lg"
            />
          </div>

          <!-- Summary -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-vattenfall text-center leading-tight">
            {{ ideaData.summary }}
          </h1>

          <!-- Key Phrases -->
          <div v-if="ideaData.key_phrases && ideaData.key_phrases.length > 0" class="mb-6">
            <div class="flex flex-wrap gap-2 justify-center">
              <span
                v-for="(phrase, index) in ideaData.key_phrases"
                :key="index"
                class="px-4 py-2 bg-[#ffda00] text-gray-900 rounded-full text-sm md:text-base font-vattenfall font-medium"
              >
                {{ phrase }}
              </span>
            </div>
          </div>

          <!-- Branding -->
          <div class="text-center mt-8 pt-6 border-t border-gray-200">
            <p class="text-sm md:text-base text-gray-600 font-vattenfall">
              Created with Vattenfall's Wind Turbine Reimagination Project
            </p>
          </div>
        </div>

        <!-- Desktop Landscape Layout -->
        <div class="hidden lg:flex lg:gap-8 lg:items-start">
          <!-- Left: Image -->
          <div class="lg:w-1/2">
            <img
              :src="ideaData.image_url"
              :alt="ideaData.summary"
              class="w-full h-auto rounded-2xl shadow-lg sticky top-8"
            />
          </div>

          <!-- Right: Content -->
          <div class="lg:w-1/2 flex flex-col">
            <!-- Summary -->
            <h1 class="text-3xl xl:text-4xl font-bold text-gray-900 mb-6 font-vattenfall leading-tight">
              {{ ideaData.summary }}
            </h1>

            <!-- Key Phrases -->
            <div v-if="ideaData.key_phrases && ideaData.key_phrases.length > 0" class="mb-8">
              <div class="flex flex-wrap gap-3">
                <span
                  v-for="(phrase, index) in ideaData.key_phrases"
                  :key="index"
                  class="px-6 py-3 bg-[#ffda00] text-gray-900 rounded-full text-lg font-vattenfall font-medium"
                >
                  {{ phrase }}
                </span>
              </div>
            </div>

            <!-- Branding -->
            <div class="mt-auto pt-8 border-t border-gray-200">
              <p class="text-base text-gray-600 font-vattenfall">
                Created with Vattenfall's Wind Turbine Reimagination Project
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VattenfallLogo from '../components/VattenfallLogo.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

const route = useRoute()
const router = useRouter()

const ideaData = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchIdeaById = async (id: string) => {
  try {
    const response = await fetch(`https://carbon-vattenfall-default-rtdb.firebaseio.com/data/${id}.json`)

    if (!response.ok) {
      throw new Error('Idea not found')
    }

    const data = await response.json()

    if (!data) {
      throw new Error('Idea not found')
    }

    ideaData.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  const ideaId = route.params.id as string
  if (ideaId) {
    fetchIdeaById(ideaId)
  } else {
    error.value = 'No idea ID provided'
    loading.value = false
  }
})
</script>
