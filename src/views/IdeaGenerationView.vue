<template>
  <div class="min-h-screen bg-white">
    <VattenfallHeader title="" />

    <!-- Main Content Area with Grid Layout -->
    <div class="px-8 pb-12 relative">
      <PageTitle title="Co-create your idea with Vattenbot" :show-close="true" close-route="/choose" />

      <div class="idea-generation-grid">
        <!-- Part Selection Display -->
        <div class="part-information">
          <p class="text-sm text-gray-500 uppercase tracking-wide mb-3 font-vattenfall">
            Selected part
          </p>

          <!-- Horizontal scrollable cards for multiple parts -->
          <div class="overflow-x-auto overflow-y-hidden">
            <div class="flex gap-6 pb-4 min-w-min">
              <div
                v-for="(part, index) in selectedParts"
                :key="part.id"
                class="idea-card bg-[#f9fafb] p-8 rounded-xl flex-shrink-0 w-[400px]"
              >
                <!-- Single column layout for card -->
                <div class="flex flex-col gap-6">
                  <!-- Part Image/Icon - Top -->
                  <div
                    class="w-full h-[200px] bg-white rounded-lg flex items-center justify-center"
                  >
                    <img
                      :src="part.iconSrc"
                      :alt="part.name"
                      class="max-w-full max-h-full object-contain p-6"
                    />
                  </div>

                  <!-- Part Details - Bottom -->
                  <div>
                    <h3 class="font-semibold mb-3 font-vattenfall" style="color: #2071b5">
                      {{ part.name }}
                    </h3>
                    <p class="text-gray-600 leading-relaxed font-vattenfall text-sm">
                      {{ part.description }}
                    </p>
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
            <div
              ref="chatMessagesContainer"
              class="chat-messages-area flex-1 overflow-y-auto px-6 py-4"
            >
              <ChatMessage
                v-for="(msg, index) in chatMessages"
                :key="index"
                :message="msg"
                @button-click="handleButtonClick"
              />

              <!-- Loading indicator -->
              <div v-if="loading" class="flex justify-start mb-4">
                <div class="bg-white border-[1.5px] border-[#d1d1d6] rounded-2xl px-5 py-3">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-2 h-2 bg-[#2071b5] rounded-full animate-bounce"
                      style="animation-delay: 0ms"
                    ></div>
                    <div
                      class="w-2 h-2 bg-[#2071b5] rounded-full animate-bounce"
                      style="animation-delay: 150ms"
                    ></div>
                    <div
                      class="w-2 h-2 bg-[#2071b5] rounded-full animate-bounce"
                      style="animation-delay: 300ms"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="chat-input-area">
              <div class="flex items-center gap-3 px-4 py-3">
                <!-- Back Arrow Button -->
                <button
                  @click="goBack"
                  class="w-18 h-18 flex items-center justify-around text-gray-600 hover:bg-gray-200 bg-[#f5f5f5] rounded-full transition-colors flex-shrink-0"
                >
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Input Field -->
                <input
                  v-model="userInput"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Ask me anything ..."
                  class="flex-1 border-none outline-none bg-[#f5f5f5] rounded-full text-gray-700 placeholder-gray-400 font-vattenfall text-xl p-6"
                />

                <!-- Send Button -->
                <button
                  @click="sendMessage"
                  :disabled="!userInput.trim() || loading"
                  class="w-18 h-18 flex bg-[#f5f5f5] items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:bg-gray-200 rounded-full"
                >
                  <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
import ChatMessage from "../components/ChatMessage.vue";
import { useSelectedPart } from "../composables/useSelectedPart";
import { useGooeyAPI, type ChatMessage as ChatMessageType } from "../composables/useGooeyAPI";

const router = useRouter();
const { getSelectedParts } = useSelectedPart();
const { callVideoBotAPI, loading } = useGooeyAPI();

// Get selected parts data from global state
const selectedParts = computed(() => {
  const parts = getSelectedParts();
  if (parts.length === 0) {
    return [
      {
        id: "default",
        name: "Turbine Blade",
        description:
          "Aerodynamic fiberglass composite blades designed to capture wind energy efficiently",
        iconSrc: "/src/assets/images/icon-connection.png",
        tags: ["Fiberglass", "Aerodynamic", "50-80m Length"],
      },
    ];
  }
  return parts;
});

// Chat state
const chatMessages = ref<ChatMessageType[]>([]);
const userInput = ref("");
const chatMessagesContainer = ref<HTMLElement | null>(null);

// Auto-scroll to bottom of chat
const scrollToBottom = async () => {
  await nextTick();
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
  }
};

// Watch for changes in chat messages and loading state
watch(
  [chatMessages, loading],
  () => {
    scrollToBottom();
  },
  { deep: true },
);

// Initialize conversation with selected parts
onMounted(async () => {
  const partsNames = selectedParts.value.map((p) => p.name).join(", ");
  await sendInitialMessage(partsNames);
});

const sendInitialMessage = async (partsNames: string) => {
  try {
    const response = await callVideoBotAPI(partsNames, []);

    if (response.output?.output_text && response.output.output_text.length > 0) {
      chatMessages.value.push({
        role: "assistant",
        content: response.output.output_text[0],
      });
    }
  } catch (error) {
    console.error("Failed to initialize conversation:", error);
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return;

  const message = userInput.value.trim();

  // Add user message to chat
  chatMessages.value.push({
    role: "user",
    content: message,
  });

  userInput.value = "";

  try {
    const response = await callVideoBotAPI(message, chatMessages.value);

    if (response.output?.output_text && response.output.output_text.length > 0) {
      chatMessages.value.push({
        role: "assistant",
        content: response.output.output_text[0],
      });
    }
  } catch (error) {
    console.error("Failed to send message:", error);
    chatMessages.value.push({
      role: "assistant",
      content: "Sorry, I encountered an error. Please try again.",
    });
  }
};

const handleButtonClick = async (buttonText: string) => {
  await sendMessage();
  userInput.value = buttonText;
  await sendMessage();
};

const goBack = () => {
  router.push("/choose");
};

const onSubmit = () => {
  // Navigate to final interaction page
  router.push("/final");
};
</script>
