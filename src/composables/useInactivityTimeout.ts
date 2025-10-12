import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

interface TimeoutConfig {
  timeoutSeconds: number;
  redirectTo: string;
  onTimeout?: () => void;
}

export function useInactivityTimeout(config: TimeoutConfig) {
  const router = useRouter();
  let timeoutId: number | null = null;

  const startTimer = () => {
    // Clear any existing timer
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Start new timer
    timeoutId = window.setTimeout(() => {
      // Call optional cleanup callback
      if (config.onTimeout) {
        config.onTimeout();
      }

      // Redirect to specified route
      router.push(config.redirectTo);
    }, config.timeoutSeconds * 1000);
  };

  const resetTimer = () => {
    startTimer();
  };

  const handleActivity = () => {
    resetTimer();
  };

  // Set up event listeners for user activity
  onMounted(() => {
    // Start the initial timer
    startTimer();

    // Listen for various user interaction events
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("mousemove", handleActivity);
  });

  // Clean up event listeners and timer on unmount
  onUnmounted(() => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    window.removeEventListener("click", handleActivity);
    window.removeEventListener("touchstart", handleActivity);
    window.removeEventListener("keydown", handleActivity);
    window.removeEventListener("scroll", handleActivity);
    window.removeEventListener("mousemove", handleActivity);
  });

  return {
    resetTimer,
  };
}
