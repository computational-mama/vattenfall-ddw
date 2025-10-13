<template>
  <div class="min-h-screen bg-white">
    <VattenfallHeader title="" />

    <!-- Main Content Area with Grid Layout -->
    <div class="px-8 pb-12 relative">
      <PageTitle
        title="Co-create your idea with Vattenbot"
        :show-close="true"
        close-route="/choose"
      />

      <div class="idea-generation-grid">
        <!-- Part Selection Display -->
        <div class="part-information">
          <h3 class="text-2xl font-bold text-black mb-4 font-vattenfall z-50">Parts selected:</h3>

          <!-- Horizontal scrollable cards for multiple parts -->
          <div class="">
            <div class="flex flex-nowrap gap-3">
              <div
                v-for="(part, index) in selectedParts"
                :key="part.id"
                class="bg-[#f9fafb] rounded-xl flex-shrink-0 w-xs border border-gray-200"
              >
                <!-- Single column layout for card -->
                <div class="flex flex-col items-center">
                  <!-- Part Image/Icon - Top -->
                  <div class="w-32 h-32 rounded-t-xl flex items-center justify-center p-2 mt-4">
                    <img
                      :src="part.iconSrc"
                      :alt="part.name"
                      class="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <!-- Part Details - Bottom -->
                  <div class="py-3 px-4">
                    <h3 class="font-bold mb-2 font-vattenfall text-xl text-[#2071b5]">
                      {{ part.name }}
                    </h3>
                    <p
                      class="text-[#333333] leading-relaxed font-vattenfall font-medium text-xs pb-2"
                    >
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
            <div class="h-18 bg-[#f6f6f6] flex flex-row p-6 items-center">
              <div class="bg-black rounded-full w-6 h-6">
                <img :src="botIcon" alt="Vattenbot Icon" class="text-white" />
              </div>
              <h3 class="text-2xl font-vattenfall font-light px-4">Generate an image</h3>
            </div>
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
              <div v-if="loading || isStreaming" class="flex justify-start mb-4">
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
                <!-- Input Field -->
                <input
                  ref="inputField"
                  v-model="userInput"
                  @keyup.enter="sendMessage"
                  @touchstart="focusInput"
                  type="text"
                  inputmode="text"
                  autocomplete="off"
                  placeholder="Ask me anything ..."
                  class="flex-1 border-none outline-none bg-[#f5f5f5] rounded-full text-gray-700 placeholder-gray-400 font-vattenfall text-xl p-6"
                />

                <!-- Send Button -->
                <button
                  @click="sendMessage"
                  :disabled="!userInput.trim() || loading || isStreaming"
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
    <!-- Fixed Footer -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#e5e5e5] z-30">
      <div class="flex items-center justify-between px-[48px] py-[32px] max-w-[1400px] mx-auto">
        <!-- Back Button -->
        <BackButton @click="backButton" />

        <!-- New IDEA -->
        <PrimaryButton label="End Session" @click="endSession" size="small" variant="secondary" />
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
import PrimaryButton from "../components/PrimaryButton.vue";
import BackButton from "../components/BackButton.vue";
import { useSelectedPart } from "../composables/useSelectedPart";
import { useGooeyAPI, type ChatMessage as ChatMessageType } from "../composables/useGooeyAPI";
import { useInactivityTimeout } from "../composables/useInactivityTimeout";
import botIcon from "../assets/images/boticon.png";
import fallbackPart from "../assets/images/icon_grid_interface_relay.svg";
const router = useRouter();
const { getSelectedParts, clearSelectedParts } = useSelectedPart();
const { callVideoBotAPI, loading, streamText, isStreaming } = useGooeyAPI();

// Inactivity timeout - 120 seconds
// Note: clearSelectedParts() is handled by router guard, no need to call it here
useInactivityTimeout({
  timeoutSeconds: 120,
  redirectTo: "/",
});

// Get selected parts data from global state
const selectedParts = computed(() => {
  const parts = getSelectedParts();
  if (parts.length === 0) {
    return [
      {
        id: "default",
        name: "Interface Relay",
        description:
          "An electrical switch that isolates and controls circuits, allowing low-voltage control signals to safely operate high-power equipment.",
        iconSrc: fallbackPart,
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
const inputField = ref<HTMLInputElement | null>(null);

// Focus input field for touchscreen
const focusInput = () => {
  if (inputField.value) {
    inputField.value.focus();
  }
};

// Auto-scroll to bottom of chat
const scrollToBottom = async () => {
  await nextTick();
  if (chatMessagesContainer.value) {
    chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight;
  }
};

// Watch for changes in chat messages, loading state, and streaming state
watch(
  [chatMessages, loading, isStreaming],
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
      const fullText = response.output.output_text[0];

      // Add placeholder message that will be updated
      const messageIndex = chatMessages.value.length;
      chatMessages.value.push({
        role: "assistant",
        content: "",
      });

      // Stream the text gradually
      await streamText(fullText, (currentText) => {
        chatMessages.value[messageIndex].content = currentText;
      });
    }
  } catch (error) {
    console.error("Failed to initialize conversation:", error);
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value || isStreaming.value) return;

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
      const fullText = response.output.output_text[0];

      // Add placeholder message that will be updated
      const messageIndex = chatMessages.value.length;
      chatMessages.value.push({
        role: "assistant",
        content: "",
      });

      // Stream the text gradually
      await streamText(fullText, (currentText) => {
        chatMessages.value[messageIndex].content = currentText;
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

const endSession = () => {
  router.push("/");
};

const backButton = () => {
  router.push("/choose");
};
</script>
