<template>
  <div class="flex flex-col items-center gap-4">
    <div class="bg-white p-4 rounded-md shadow-sm">
      <canvas ref="qrCanvas"></canvas>
    </div>
    <p v-if="label" class="text-sm text-gray-600 font-vattenfall">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import QRCode from "qrcode";

interface Props {
  url: string;
  size?: number;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 256,
  label: "Scan to save your idea",
});

const qrCanvas = ref<HTMLCanvasElement | null>(null);

const generateQRCode = async () => {
  if (!qrCanvas.value) return;

  try {
    await QRCode.toCanvas(qrCanvas.value, props.url, {
      width: props.size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};

onMounted(() => {
  generateQRCode();
});

watch(
  () => props.url,
  () => {
    generateQRCode();
  },
);
</script>
