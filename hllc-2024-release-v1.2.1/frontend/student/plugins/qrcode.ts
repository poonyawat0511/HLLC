// plugins/qrcode.ts
import { defineNuxtPlugin } from '#app'
import QRCode from 'qrcode'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      generateQRCode: async (text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> => {
        try {
          return await QRCode.toDataURL(text, options)
        } catch (error) {
          console.error('Failed to generate QR code', error)
          throw error
        }
      }
    }
  }
})
