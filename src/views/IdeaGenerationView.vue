<template>
  <div class="bg-white flex flex-col overflow-hidden" style="height: 100vh; height: 100dvh">
    <VattenfallHeader title="" class="flex-shrink-0" />

    <!-- Main Content Area with Grid Layout -->
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden p-3 md:px-6 kiosk:px-8">
      <PageTitle
        title="Rewind is here to co-create with you"
        :show-close="true"
        close-route="/choose"
        class="flex-shrink-0"
      />

      <div class="idea-generation-grid">
        <!-- Part Selection Display -->

        <!-- Chat Interface -->
        <div class="chat-interface mt-2">
          <div class="chat-content">
            <div class="bg-[#f6f6f6] flex flex-row p-2 md:p-2 items-center">
              <!-- <div class="bg-black rounded-full w-6 h-6">
                <img :src="botIcon" alt="Vattenbot Icon" class="text-white" />
              </div> -->
              <h3 class="text-lg font-vattenfall font-light px-4">Let's imagine together</h3>
            </div>
            <!-- Chat Messages Area -->
            <div ref="chatMessagesContainer" class="chat-messages-area flex-1 overflow-y-auto p-2">
              <!-- One-time parts intro at top of chat -->
              <div class="mb-4 px-1">
                <p class="text-md text-[#2071b5] font-vattenfall mb-2">Why it matters?</p>
                <div class="flex flex-nowrap gap-2 overflow-x-auto pb-1">
                  <div
                    v-for="part in partsWithWhyMatters"
                    :key="part.id"
                    class="flex-shrink-0 flex items-center gap-2 bg-[#f9fafb] border border-gray-200 rounded-xl px-3 py-2 w-[220px] md:w-[260px]"
                  >
                    <img
                      :src="part.iconSrc"
                      :alt="part.name"
                      class="w-10 h-10 object-contain flex-shrink-0"
                    />
                    <div class="min-w-0">
                      <p
                        class="font-bold font-vattenfall text-xs text-[#2071b5] leading-tight truncate"
                      >
                        {{ part.name }}
                      </p>
                      <p class="text-[10px] text-gray-500 font-vattenfall leading-tight mt-0.5">
                        {{ part.whyMatters }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ChatMessage
                v-for="(msg, index) in chatMessages"
                :key="index"
                :message="msg"
                @button-click="handleButtonClick"
                @save-idea="handleSaveIdea"
              />

              <!-- Loading indicator -->
              <div v-if="loading || isStreaming" class="flex flex-col items-start mb-4">
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
                <!-- Loading phrase -->
                <p
                  v-if="currentLoadingPhrase"
                  class="mt-2 ml-2 text-sm font-vattenfall text-gray-400 italic"
                >
                  {{ currentLoadingPhrase }}
                </p>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="chat-input-area" @click="focusInput">
              <div class="flex items-center p-1">
                <!-- Input Field -->
                <input
                  ref="inputField"
                  v-model="userInput"
                  @keyup.enter="sendMessage"
                  @touchend="focusInput"
                  type="text"
                  inputmode="text"
                  autocomplete="off"
                  placeholder="Ask me anything ..."
                  class="flex-1 border-none outline-none bg-[#f5f5f5] rounded-full text-gray-700 placeholder-gray-400 font-vattenfall text-sm p-3 md:text-xl md:p-6"
                />

                <!-- Send Button -->
                <button
                  @click="sendMessage"
                  :disabled="!userInput.trim() || loading || isStreaming"
                  class="w-10 h-10 md:w-18 md:h-18 flex bg-[#f5f5f5] items-center justify-center text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:bg-gray-200 rounded-full"
                >
                  <svg class="w-5 h-5 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div class="bg-white border-t-2 border-[#e5e5e5] flex-shrink-0">
      <div
        class="flex items-center justify-between px-4 py-2 md:px-8 md:py-5 kiosk:px-[48px] kiosk:py-[32px] max-w-[1400px] mx-auto"
      >
        <!-- Back Button -->
        <BackButton @click="backButton" />

        <!-- New IDEA -->
        <PrimaryButton label="End Session" @click="endSession" size="small" variant="secondary" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import VattenfallHeader from "../components/VattenfallHeader.vue";
import PageTitle from "../components/PageTitle.vue";
import ChatMessage from "../components/ChatMessage.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import BackButton from "../components/BackButton.vue";
import { useSelectedPart } from "../composables/useSelectedPart";
import { useGooeyAPI, type ChatMessage as ChatMessageType } from "../composables/useGooeyAPI";
import { partsData } from "../data/partsData";
import { useInactivityTimeout } from "../composables/useInactivityTimeout";
import {
  generalLoadingPhrases,
  sketchLoadingPhrases,
  saveLoadingPhrases,
} from "../data/loadingPhrases";
import botIcon from "../assets/images/boticon.png";
import fallbackPart from "../assets/images/icon_grid_interface_relay.svg";
const router = useRouter();
const { getSelectedParts, clearSelectedParts } = useSelectedPart();
const { callVideoBotAPI, loading, streamText, isStreaming } = useGooeyAPI();

// Inactivity timeout - 120 seconds
// Note: clearSelectedParts() is handled by router guard, no need to call it here
useInactivityTimeout({
  timeoutSeconds: 600,
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

// Enrich selectedParts with whyMatters from partsData CSV
const partsWithWhyMatters = computed(() =>
  selectedParts.value.map((part) => {
    const csvPart = partsData.find((p) => p.id === part.id);
    return { ...part, whyMatters: csvPart?.whyMatters ?? "" };
  }),
);

// Chat state
const chatMessages = ref<ChatMessageType[]>([]);
const userInput = ref("");
const chatMessagesContainer = ref<HTMLElement | null>(null);
const inputField = ref<HTMLInputElement | null>(null);

// Loading phrases state
const currentLoadingPhrase = ref("");
const loadingPhraseIndex = ref(0);
const loadingPhraseInterval = ref<number | null>(null);
const currentActionType = ref<"general" | "sketch" | "save">("general");

// Start cycling through loading phrases
const startLoadingPhrases = (actionType: "general" | "sketch" | "save" = "general") => {
  currentActionType.value = actionType;
  loadingPhraseIndex.value = 0;

  // Get the appropriate phrase array
  const phrases =
    actionType === "sketch"
      ? sketchLoadingPhrases
      : actionType === "save"
        ? saveLoadingPhrases
        : generalLoadingPhrases;

  // Set initial phrase
  currentLoadingPhrase.value = phrases[0];

  // Clear any existing interval
  if (loadingPhraseInterval.value !== null) {
    clearInterval(loadingPhraseInterval.value);
  }

  // Cycle through phrases every 2 seconds
  loadingPhraseInterval.value = window.setInterval(() => {
    loadingPhraseIndex.value = (loadingPhraseIndex.value + 1) % phrases.length;
    currentLoadingPhrase.value = phrases[loadingPhraseIndex.value];
  }, 2000);
};

// Stop cycling loading phrases
const stopLoadingPhrases = () => {
  if (loadingPhraseInterval.value !== null) {
    clearInterval(loadingPhraseInterval.value);
    loadingPhraseInterval.value = null;
  }
  currentLoadingPhrase.value = "";
};

// Watch loading state to control phrase cycling
watch([loading, isStreaming], ([isLoading, streaming]) => {
  if (isLoading || streaming) {
    if (!loadingPhraseInterval.value) {
      startLoadingPhrases(currentActionType.value);
    }
  } else {
    stopLoadingPhrases();
  }
});

// Focus input field for touchscreen.
// On iOS, after a programmatic scroll the keyboard can hide while the input
// stays "focused" in the DOM. A subsequent tap fires no focus event, so the
// keyboard never reopens. Forcing blur→focus within the touch/click gesture
// makes iOS treat it as a fresh focus and reliably shows the keyboard.
const focusInput = (event?: Event) => {
  if (!inputField.value) return;
  // Avoid double-firing when the click event bubbles up from the input itself
  // after touchend has already handled it.
  if (event?.type === "click" && event.target === inputField.value) return;
  inputField.value.blur();
  inputField.value.focus();
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
  // Set appropriate loading phrase type based on button
  if (buttonText.includes("Sketch the idea")) {
    currentActionType.value = "sketch";
  } else if (buttonText.includes("Save the idea")) {
    currentActionType.value = "save";
  } else {
    currentActionType.value = "general";
  }

  userInput.value = buttonText;
  await sendMessage();
};

const handleSaveIdea = async (buttonText: string) => {
  currentActionType.value = "save";
  userInput.value = buttonText;
  await sendMessage();
  router.push("/final");
};

const endSession = () => {
  router.push("/");
};

const backButton = () => {
  router.push("/choose");
};

// Cleanup on unmount
onUnmounted(() => {
  stopLoadingPhrases();
});
</script>
