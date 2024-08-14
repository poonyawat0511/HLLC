<script setup lang="ts">
import type { QRCodeToDataURLOptions } from 'qrcode'
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify'
const { data: user } = useAuth()
const { xs } = useDisplay()
const { colors } = useSchool()

const qrCode = ref<string | null>(null)
const qrCanvas = ref<HTMLCanvasElement | null>(null)

const generateQRCode = async () => {
  if (user.value?.username) {
    try {
      const QRCode = await import('qrcode')
      const options: QRCodeToDataURLOptions = {
        width: 1500,
        margin: 1,
        version: 5,
        rendererOpts: { quality: 10 },
      }
      qrCode.value = await QRCode.toDataURL(user.value?.username, options)
      drawQRCodeWithLogo()
    } catch (error) {
      console.error('Failed to generate QR code', error)
    }
  } else {
    qrCode.value = null
  }
}

const drawQRCodeWithLogo = async () => {
  if (!qrCode.value || !qrCanvas.value) return

  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')

  if (!ctx) return
  const qrImage = new Image()
  const logoImage = new Image()

  qrImage.src = qrCode.value
  logoImage.src = '/hllc/sdad-logo.png'

  qrImage.onload = () => {
    const qrSize = 300
    const logoSize = 60
    const logoMargin = 5

    canvas.width = qrSize
    canvas.height = qrSize
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize)

    logoImage.onload = () => {
      const x = (qrSize - logoSize) / 2
      const y = (qrSize - logoSize) / 2

      ctx.fillStyle = '#FFFFFF'
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 2

      drawRoundedRect(
        ctx,
        x - logoMargin,
        y - logoMargin,
        logoSize + 2 * logoMargin,
        logoSize + 2 * logoMargin,
        30
      )
      ctx.fill()
      ctx.stroke()
      ctx.drawImage(logoImage, x, y, logoSize, logoSize)
    }
  }
}

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

const downloadQRCode = () => {
  if (!qrCanvas.value) return

  const link = document.createElement('a')
  link.href = qrCanvas.value.toDataURL('image/png')
  link.download = 'qr-code.png'
  link.click()
}

onMounted(() => {
  generateQRCode()
})
</script>

<template>
  <div>
    <v-card
      :color="colors['card-surface']"
      rounded="xl"
      elevation="0"
      class="mx-auto"
    >
      <v-card-title class="text-center">
        {{ user.fullName }}
      </v-card-title>
      <v-card-subtitle class="text-center">
        {{ $t('studentId') }} {{ user.username }}
      </v-card-subtitle>
      <v-card-text>
        <v-card
          rounded="xl"
          elevation="0"
          class="pa-4 mx-auto"
          :width="!xs ? '40%' : '100%'"
        >
          <canvas ref="qrCanvas" style="display: none" />
          <v-img v-if="qrCode" :src="qrCode" alt="Generated QR Code" contain />
          <v-img v-else src="no-img.png" alt="No QR Code Available" contain />
          <div v-if="qrCode" class="center-image">
            <v-card class="logo-card" outlined tile rounded="xl">
              <v-img src="/hllc/sdad-logo.png" alt="Center Image" contain />
            </v-card>
          </div>
        </v-card>
        <p
          class="text-center font-weight-bold mt-4"
        >
          {{ $t('qrCodeOne') }}
        </p>
          
      </v-card-text>
      <v-card-actions class="mb-4 mt-n3">
        <v-spacer />
        <v-btn
          rounded="xl"
          prepend-icon="mdi-download"
          variant="flat"
          color="primary"
          class="px-5 text-white"
          @click="downloadQRCode"
        >
        {{ $t('Save') }}
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>

.center-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.logo-card {
  width: 60px;
  height: 60px;
  padding: 5px;
  position: relative;
}
</style>
