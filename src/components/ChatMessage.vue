<template>
  <div :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start', 'mb-4']">
    <div
      :class="[
        'max-w-[90%] md:max-w-[80%] rounded-2xl p-3 md:p-8',
        'text-[#333333]',
      ]"
    >
      <!-- Vattenbot header for assistant messages -->
      <div v-if="message.role === 'assistant'" class="flex items-center gap-2 mb-2">
        <div class="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <img :src="botIcon" alt="Vattenbot Icon" class="text-white" />
        </div>
        <span class="text-sm md:text-xl font-bold text-[#333333] font-vattenfall">Rewind</span>
      </div>

      <!-- User header for user messages -->
      <div v-if="message.role === 'user'" class="flex items-center gap-2 mb-2">
        <span class="text-sm md:text-xl font-bold text-gray-700 font-vattenfall">You</span>
      </div>

      <!-- Message content -->
      <div
        :class="[
          'font-vattenfall leading-relaxed text-md',
          message.role === 'user' ? 'bg-[#EDF9F3] text-[#333333] p-3 md:p-8 rounded-xl' : 'text-[#333333]',
        ]"
        v-html="parsedContent"
      ></div>

      <!-- Interactive buttons -->
      <div v-if="parsedButtons.length > 0" class="mt-4">
        <!-- Regular buttons - original stacked layout -->
        <div class="space-y-2 mb-4">
          <button
            v-for="(btn, index) in parsedButtons.filter((b) => !isPrimaryActionButton(b.text))"
            :key="'regular-' + index"
            @click="handleButtonClick(btn.text)"
            class="w-full flex items-center justify-between px-4 py-3 md:py-6 bg-white border-2 border-[#2071B5]/20 text-[#2071B5] rounded-xl hover:bg-[#2071B5] hover:text-white transition-all font-vattenfall font-medium text-left text-sm md:text-base"
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

        <!-- Primary action buttons (Sketch/Save) - centered horizontal layout at bottom -->
        <div
          v-if="parsedButtons.some((btn) => isPrimaryActionButton(btn.text))"
          class="flex gap-4 justify-self-stretch w-full"
        >
          <PrimaryButton
            v-for="(btn, index) in parsedButtons.filter((b) => isPrimaryActionButton(b.text))"
            :key="'primary-' + index"
            :label="btn.text"
            size="chat"
            variant="primary"
            @click="handleButtonClick(btn.text)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { marked } from "marked";
import type { ChatMessage as ChatMessageType } from "../composables/useGooeyAPI";
import botIcon from "../assets/images/boticon.png";
import PrimaryButton from "./PrimaryButton.vue";

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

const isPrimaryActionButton = (buttonText: string): boolean => {
  const primaryButtons = ["Sketch the idea", "Save my idea", "Thanks I'm done"];
  return primaryButtons.some((primaryBtn) => buttonText.includes(primaryBtn));
};

const handleButtonClick = (buttonText: string) => {
  if (buttonText.includes("Thanks") && buttonText.includes("done")) {
    router.push("/final");
  } else {
    emit("button-click", buttonText);
  }
};

const BUTTON_RE = /<button[^>]*gui-target="input_prompt"[^>]*>(.*?)<\/button>/g;

const parsedButtons = computed((): ParsedButton[] => {
  const matches = [...props.message.content.matchAll(BUTTON_RE)];
  return matches.map((match) => ({ text: match[1].trim() }));
});

const parsedContent = computed(() => {
  const content = props.message.content.replace(BUTTON_RE, "");
  return marked.parse(content.trim(), { breaks: true }) as string;
});
</script>

<style scoped>
:deep(.font-vattenfall strong) { font-weight: 700; }
:deep(.font-vattenfall em) { font-style: italic; }
:deep(.font-vattenfall p) { margin-bottom: 0.5rem; }
:deep(.font-vattenfall p:last-child) { margin-bottom: 0; }
:deep(.font-vattenfall ul) { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.5rem; }
:deep(.font-vattenfall ol) { list-style: decimal; padding-left: 1.25rem; margin-bottom: 0.5rem; }
:deep(.font-vattenfall li) { margin-bottom: 0.25rem; }
:deep(.font-vattenfall img) { border-radius: 0.5rem; margin: 1rem 0; max-width: 100%; }
</style>
