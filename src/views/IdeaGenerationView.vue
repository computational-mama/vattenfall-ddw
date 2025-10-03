<template>
  <div class="min-h-screen bg-white">
    <VattenfallHeader title="" />

    <!-- Main Content Area with Grid Layout -->
    <div class="px-8 pb-12">
      <PageTitle title="Generate and share your idea" />

      <div class="idea-generation-grid">

        <!-- Vattenbot Header -->
        <div class="vattenbot-header idea-card">
          <div class="px-6 py-4 flex items-center gap-3" style="background-color: #196db9">
            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg class="w-5 h-5" fill="#196DB9" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-white vattenbot-title font-vattenfall">Vattenbot</h2>
          </div>
        </div>

        <!-- Part Selection Display -->
        <div class="part-information idea-card">
          <div class="part-info-content">
            <div class="flex-1">
              <p class="text-sm text-gray-500 uppercase tracking-wide mb-3 font-vattenfall">
                PART{{ selectedParts.length > 1 ? 'S' : '' }} SELECTED:
              </p>

              <!-- Multiple Parts Display -->
              <div v-for="(part, index) in selectedParts" :key="part.id" class="mb-6">
                <div class="flex items-start gap-4">
                  <!-- Part Icon -->
                  <div class="part-icon-container flex-shrink-0">
                    <img
                      :src="part.iconSrc"
                      :alt="part.name"
                      class="w-16 h-16 object-contain"
                    />
                  </div>

                  <!-- Part Details -->
                  <div class="flex-1">
                    <h3 class="text-2xl font-semibold mb-2 font-vattenfall" style="color: #196db9">
                      Part {{ index + 1 }}: {{ part.name }}
                    </h3>
                    <p class="text-gray-600 mb-3 leading-relaxed text-base font-vattenfall">
                      {{ part.description }}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2" v-if="part.tags">
                      <span
                        v-for="tag in part.tags"
                        :key="tag"
                        class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-vattenfall"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Interface -->
        <div class="chat-interface">
          <div class="chat-content">
            <!-- Chat Messages Area -->
            <div ref="chatMessagesContainer" class="chat-messages-area flex-1 overflow-y-auto px-6 py-4">
              <ChatMessage
                v-for="(msg, index) in chatMessages"
                :key="index"
                :message="msg"
                @button-click="handleButtonClick"
              />

              <!-- Loading indicator -->
              <div v-if="loading" class="flex justify-start mb-4">
                <div class="bg-white border border-gray-200 rounded-2xl px-5 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-[#396fb0] rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 bg-[#396fb0] rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-2 h-2 bg-[#396fb0] rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="chat-input-area">
              <div class="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                <input
                  v-model="userInput"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Ask me anything..."
                  class="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-lg font-vattenfall"
                />
                <button
                  @click="sendMessage"
                  :disabled="!userInput.trim() || loading"
                  class="w-12 h-12 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style="background-color: #196db9"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <NavigationFooter>
      <NavigationButtons
        back-text="Back"
        next-text="Submit"
        @back="goBack"
        @next="onSubmit"
      />
    </NavigationFooter>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from "vue-router"
import VattenfallHeader from '../components/VattenfallHeader.vue'
import PageTitle from '../components/PageTitle.vue'
import NavigationFooter from '../components/NavigationFooter.vue'
import NavigationButtons from '../components/NavigationButtons.vue'
import ChatMessage from '../components/ChatMessage.vue'
import { useSelectedPart } from '../composables/useSelectedPart'
import { useGooeyAPI, type ChatMessage as ChatMessageType } from '../composables/useGooeyAPI'

const router = useRouter()
const { getSelectedParts } = useSelectedPart()
const { callVideoBotAPI, loading } = useGooeyAPI()

// Get selected parts data from global state
const selectedParts = computed(() => {
  const parts = getSelectedParts()
  if (parts.length === 0) {
    return [{
      id: "default",
      name: "Turbine Blade",
      description: "Aerodynamic fiberglass composite blades designed to capture wind energy efficiently",
      iconSrc: "/src/assets/images/icon-connection.png",
      tags: ["Fiberglass", "Aerodynamic", "50-80m Length"]
    }]
  }
  return parts
})

// Chat state
const chatMessages = ref<ChatMessageType[]>([])
const userInput = ref('')
const chatMessagesContainer = ref<HTMLElement | null>(null)

// Auto-scroll to bottom of chat
const scrollToBottom = async () => {
  await nextTick()
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
  }
}

// Watch for changes in chat messages and loading state
watch([chatMessages, loading], () => {
  scrollToBottom()
}, { deep: true })

// Initialize conversation with selected parts
onMounted(async () => {
  const partsNames = selectedParts.value.map(p => p.name).join(', ')
  await sendInitialMessage(partsNames)
})

const sendInitialMessage = async (partsNames: string) => {
  try {
    const response = await callVideoBotAPI(partsNames, [])

    if (response.output?.output_text && response.output.output_text.length > 0) {
      chatMessages.value.push({
        role: 'assistant',
        content: response.output.output_text[0]
      })
    }
  } catch (error) {
    console.error('Failed to initialize conversation:', error)
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return

  const message = userInput.value.trim()

  // Add user message to chat
  chatMessages.value.push({
    role: 'user',
    content: message
  })

  userInput.value = ''

  try {
    const response = await callVideoBotAPI(message, chatMessages.value)

    if (response.output?.output_text && response.output.output_text.length > 0) {
      chatMessages.value.push({
        role: 'assistant',
        content: response.output.output_text[0]
      })
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    chatMessages.value.push({
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.'
    })
  }
}

const handleButtonClick = async (buttonText: string) => {
  await sendMessage()
  userInput.value = buttonText
  await sendMessage()
}

const goBack = () => {
  router.push("/choose")
}

const onSubmit = () => {
  // Navigate to final interaction page
  router.push("/final")
}
</script>
