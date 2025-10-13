<template>
  <div :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start', 'mb-4']">
    <div
      :class="[
        'max-w-[80%] rounded-2xl p-8',
        message.role === 'user' ? 'text-[#333333]' : ' text-[#33333]',
      ]"
    >
      <!-- Vattenbot header for assistant messages -->
      <div v-if="message.role === 'assistant'" class="flex items-center gap-2 mb-2">
        <div class="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <img :src="botIcon" alt="Vattenbot Icon" class="text-white" />
        </div>
        <span class="text-xl font-bold text-[#333333] font-vattenfall">Vattenbot</span>
      </div>

      <!-- User header for user messages -->
      <div v-if="message.role === 'user'" class="flex items-center gap-2 mb-2">
        <!-- <div class="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <img :src="botIcon" alt="Vattenbot Icon" class="text-white" />
        </div> -->
        <span class="text-xl font-bold text-gray-700 font-vattenfall">You</span>
      </div>

      <!-- Message content -->
      <div
        :class="[
          'font-vattenfall leading-relaxed text-md',
          message.role === 'user' ? 'bg-[#EDF9F3] text-[#333333] p-8 rounded-xl' : ' text-[#33333]',
        ]"
        v-html="parsedContent"
      ></div>

      <!-- Interactive buttons -->
      <div v-if="parsedButtons.length > 0" class="mt-4 space-y-2 text-md">
        <button
          v-for="(btn, index) in parsedButtons"
          :key="index"
          @click="handleButtonClick(btn.text)"
          class="w-full flex items-center justify-between px-4 py-8 bg-white border-2 border-[#2071B5]/20 text-[#2071B5] rounded-xl hover:bg-[#2071B5] hover:text-white transition-all font-vattenfall font-medium text-left"
        >
          <span>{{ btn.text }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { ChatMessage as ChatMessageType } from "../composables/useGooeyAPI";
import botIcon from "../assets/images/boticon.png";

interface Props {
  message: ChatMessageType;
}

interface ParsedButton {
  text: string;
}

const emit = defineEmits<{
  "button-click": [text: string];
}>();

const props = defineProps<Props>();
const router = useRouter();

// Handle button click with special case for "done" button
const handleButtonClick = (buttonText: string) => {
  // Check if this is the "Thanks I'm done" button
  if (buttonText.includes("Thanks") && buttonText.includes("done")) {
    // Navigate to final view
    router.push("/final");
  } else {
    // Emit normal button click event
    emit("button-click", buttonText);
  }
};

// Parse HTML buttons from message content
const parsedButtons = computed((): ParsedButton[] => {
  const buttonRegex = /<button[^>]*gui-target="input_prompt"[^>]*>(.*?)<\/button>/g;
  const matches = [...props.message.content.matchAll(buttonRegex)];
  return matches.map((match) => ({ text: match[1].trim() }));
});

// Remove buttons from content for display
const parsedContent = computed(() => {
  let content = props.message.content;
  // Remove button HTML tags
  content = content.replace(/<button[^>]*gui-target="input_prompt"[^>]*>.*?<\/button>/g, "");
  // Convert markdown images to img tags
  content = content.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full" />',
  );
  // Convert line breaks
  // content = content.replace(/\n/g, "<br>");
  return content.trim();
});
</script>
