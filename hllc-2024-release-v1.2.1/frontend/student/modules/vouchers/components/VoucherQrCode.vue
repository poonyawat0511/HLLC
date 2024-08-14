<script setup lang="ts">
import type { QRCodeToDataURLOptions } from 'qrcode'
interface Props {
  item: string
}

const props = withDefaults(defineProps<Props>(), {
  item: 'hllc2024',
})

const qrCode = ref<string | null>(null)

const generateQRCode = async () => {
  if (props.item) {
    try {
      const QRCode = await import('qrcode')
      const options: QRCodeToDataURLOptions = {
        width: 1500,
        margin: 1,
        version: 5,
        rendererOpts: { quality: 10 },
      }
      qrCode.value = await QRCode.toDataURL(props.item, options)
    } catch (error) {
      console.error('Failed to generate QR code', error)
    }
  } else {
    qrCode.value = null
  }
}

onMounted(() => {
  generateQRCode()
})
</script>
<template>
  <div :style="{ 'height': '60px','width':'60px','padding':'2px'}">
    <v-img v-if="qrCode" :src="qrCode" alt="Generated QR Code" contain />
  </div>
</template>
