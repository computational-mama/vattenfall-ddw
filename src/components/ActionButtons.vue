<template>
  <div class="flex gap-4 justify-center mt-8">
    <button
      @click="exploreQualities"
      :disabled="loading"
      class="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 disabled:opacity-50"
    >
      <div v-if="loading && activeAction === 'qualities'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>{{ loading && activeAction === 'qualities' ? 'Exploring...' : 'Explore this part\'s qualities' }}</span>
      <svg v-if="!loading || activeAction !== 'qualities'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>

    <button
      @click="viewSubmittedIdeas"
      :disabled="loading"
      class="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 disabled:opacity-50"
    >
      <div v-if="loading && activeAction === 'ideas'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span>{{ loading && activeAction === 'ideas' ? 'Loading...' : 'View submitted ideas' }}</span>
      <svg v-if="!loading || activeAction !== 'ideas'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>

  <!-- Results Display -->
  <div v-if="results.length > 0" class="mt-8 space-y-4">
    <h3 class="text-xl font-semibold text-white text-center">Generated Ideas:</h3>
    <div class="grid gap-3">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white border border-white/20"
      >
        <p class="text-sm leading-relaxed">{{ result }}</p>
      </div>
    </div>
  </div>

  <!-- Error Display -->
  <div v-if="error" class="mt-4 bg-red-500/20 backdrop-blur-sm rounded-lg p-4 text-white text-center border border-red-300/30">
    <p class="text-sm">⚠️ {{ error }}</p>
    <button @click="clearError" class="mt-2 text-xs underline hover:no-underline">Dismiss</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGooeyAPI, type GooeyAPIResponse } from '../composables/useGooeyAPI'
import type { PartData } from '../composables/useSelectedPart'

interface Props {
  selectedParts?: PartData[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedParts: () => []
})

// Computed properties for parts information
const partsNames = computed(() => {
  if (props.selectedParts.length === 0) return 'the selected parts'
  if (props.selectedParts.length === 1) return props.selectedParts[0].name
  return props.selectedParts.map(p => p.name).join(', ')
})

const partsDescriptions = computed(() => {
  return props.selectedParts.map((part, index) =>
    `Part ${index + 1} (${part.name}): ${part.description}`
  ).join('\n')
})

const { callGooeyAPI, loading, error } = useGooeyAPI()
const results = ref<string[]>([])
const activeAction = ref<'qualities' | 'ideas' | null>(null)

const exploreQualities = async () => {
  activeAction.value = 'qualities'
  results.value = []

  const prompt = `You are a circular economy expert helping Vattenfall explore creative reuse applications for decommissioned wind turbine components. Generate 3 short, provocative conversation starter prompts (5-8 words each) for repurposing ${partsNames.value}.

Current parts context:
${partsDescriptions.value}

Focus on:
- Innovative applications beyond obvious uses
- Cross-industry opportunities combining ${props.selectedParts.length > 1 ? 'these parts together' : 'this part'}
- Community and social impact potential
- Technical feasibility considerations
- New business model possibilities

Format as brief questions or statements that spark immediate discussion. Avoid repetition of previous suggestions. Prioritize unexpected, creative directions while maintaining practical grounding.

Return as JSON with format: {"prompts": ["prompt1", "prompt2", "prompt3"]}`

  try {
    const response = await callGooeyAPI(prompt)
    results.value = parseAPIResponse(response)
  } catch (err) {
    console.error('Failed to explore qualities:', err)
  } finally {
    activeAction.value = null
  }
}

const viewSubmittedIdeas = async () => {
  activeAction.value = 'ideas'
  results.value = []

  const prompt = `You are reviewing previously submitted community ideas for repurposing ${partsNames.value} from decommissioned wind turbines.

Current parts being reimagined:
${partsDescriptions.value}

Generate 3 example realistic community-submitted ideas showing diverse creative approaches${props.selectedParts.length > 1 ? ' that combine these parts together' : ''}.

Include for each:
- Brief description of the reuse concept
- Potential community impact
- Implementation feasibility notes

Make them diverse and creative while staying realistic for actual wind turbine component reuse.

Return as JSON with format: {"prompts": ["idea1", "idea2", "idea3"]}`

  try {
    const response = await callGooeyAPI(prompt)
    results.value = parseAPIResponse(response)
  } catch (err) {
    console.error('Failed to view submitted ideas:', err)
  } finally {
    activeAction.value = null
  }
}

const parseAPIResponse = (response: GooeyAPIResponse): string[] => {
  try {
    // Navigate the nested response structure as shown in the image
    const outputText = response.output?.output_text?.gpt_5_mini?.[0]

    if (outputText && Array.isArray(outputText.prompts)) {
      return outputText.prompts.slice(0, 3)
    }

    // Fallback: try to parse if it's a string
    if (typeof outputText === 'string') {
      const parsed = JSON.parse(outputText)
      if (parsed.prompts && Array.isArray(parsed.prompts)) {
        return parsed.prompts.slice(0, 3)
      }
    }

    return ['No ideas generated. Please try again.']
  } catch (err) {
    console.error('Failed to parse API response:', err)
    return ['Failed to parse response. Please try again.']
  }
}

const clearError = () => {
  error.value = null
}

// Auto-generate ideas when component mounts
onMounted(() => {
  exploreQualities()
})
</script>