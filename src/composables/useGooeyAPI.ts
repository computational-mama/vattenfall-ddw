import { ref } from "vue";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GooeyVideoBotResponse {
  id: string;
  url: string;
  created_at: string;
  output: {
    final_prompt: ChatMessage[];
    output_text: string[];
    raw_output_text: string[];
    output_audio: string | null;
    output_video: string | null;
    finish_reason: string[];
    called_functions: string[];
  };
}

// Legacy response type for backwards compatibility
export interface GooeyAPIResponse {
  id: string;
  url: string;
  created_at: string;
  output: {
    output_text: {
      gpt_5_mini: Array<{
        prompts: string[];
      }>;
    };
  };
}

export const useGooeyAPI = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const messages = ref<ChatMessage[]>([]);

  const callVideoBotAPI = async (
    inputPrompt: string,
    conversationHistory?: ChatMessage[],
  ): Promise<GooeyVideoBotResponse> => {
    loading.value = true;
    error.value = null;

    const payload = {
      input_prompt: inputPrompt,
      messages: conversationHistory || messages.value,
    };

    try {
      const response = await fetch("https://api.gooey.ai/v2/video-bots?example_id=dma60z29q7ru", {
        method: "POST",
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_GOOEY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update conversation history
      if (result.output?.final_prompt) {
        messages.value = result.output.final_prompt;
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const resetConversation = () => {
    messages.value = [];
  };

  // Legacy method for backwards compatibility
  const callGooeyAPI = async (inputPrompt: string): Promise<GooeyAPIResponse> => {
    loading.value = true;
    error.value = null;

    const payload = {
      input_prompt: inputPrompt,
      selected_models: ["gpt_5_mini"],
      response_format_type: "json_object",
    };

    try {
      const response = await fetch("https://api.gooey.ai/v2/CompareLLM?example_id=06z1w2fdvs8s", {
        method: "POST",
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_GOOEY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      error.value = errorMessage;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    callGooeyAPI,
    callVideoBotAPI,
    resetConversation,
    messages,
    loading,
    error,
  };
};
