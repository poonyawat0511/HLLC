<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })

interface Props {
  item: VoucherCode | null
}

const emits = defineEmits(['confirm'])
const props = defineProps<Props>()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const { colors } = useSchool()

const isFlipped = ref(false)
const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const isExp = computed(() => {
  const currentTime = new Date()
  if (!props.item?.voucher.exp) {
    return false
  }
  return currentTime >= new Date(props.item?.voucher.exp)
})

const isConfirmDialogOpen = ref(false)
const openConfirmDialog = () => {
  isConfirmDialogOpen.value = true
}
function confirmAction(item: any) {
  emits('confirm', item)
  isConfirmDialogOpen.value = false
  dialog.value = false
}
const cancelUseVoucher = () => {
  isConfirmDialogOpen.value = false
}
</script>
<template>
  <v-dialog
    v-model="dialog"
    content-class="elevation-0"
    max-width="30rem"
    opacity="0.7"
  >
    <v-card rounded="xl" elevation="0" color="transparent">
      <v-card-title class="d-flex justify-space-between mb-n1">
        <h4 class="text-white">{{ item?.voucher?.sponsor?.name?.[lang] }}</h4>
        <v-icon icon="mdi-close" color="white" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <div class="flip-card" @click="flipCard">
          <div class="flip-card-inner" :class="{ 'is-flipped': isFlipped }">
            <div class="flip-card-front text-center">
              <!-- Front content -->
              <div class="d-flex justify-center">
                <v-img
                  :src="item?.voucher.voucherImages.front"
                  max-width="16rem"
                  contain
                />
              </div>
              <div>
                <v-avatar image="Flip.png" size="60px" />
                <p class="text-white mt-n2">{{ $t('Filp') }}</p>
              </div>
            </div>
            <div class="flip-card-back text-center">
              <!-- Back content -->
              <div>
                <div class="d-flex justify-center">
                  <v-img
                    :src="item?.voucher.voucherImages.back"
                    max-width="16rem"
                    contain
                  >
                    <div
                      style="position: absolute; bottom: 2rem; width: 100%"
                    >
                      <div v-if="item?.type == 'UNUSED' && !isExp">
                        <div v-if="item?.voucher.sponsor.type == 'NORMAL'">
                          <v-btn
                            rounded
                            variant="flat"
                            color="primary"
                            class="px-3 mt-7"
                            @click="openConfirmDialog()"
                          >
                            {{ $t('Use') }}
                          </v-btn>
                          <p class="text-title mt-2" style="font-size: 12px">
                            {{ $t('bottomUse') }}
                          </p>
                        </div>
                        <div v-else class="mt-1 mx-auto">
                          <voucher-qr-code class="mx-auto" :item="item.code"></voucher-qr-code>
                          <p class="text-title">{{ item?.code }}</p>
                        </div>
                      </div>
                      <div v-if="item?.type == 'UNUSED' && isExp">
                        <v-img
                          height="60px"
                          width="60px"
                          class="image-filter mx-auto"
                          src="hllc/SD.png"
                        ></v-img>
                        <p style="font-size: 12px" class="text-content">
                          {{ $t('isExp') }}
                        </p>
                      </div>
                      <div v-if="item?.type == 'USED'">
                        <v-img
                          height="60px"
                          width="60px"
                          class="image-filter mx-auto"
                          src="hllc/SD.png"
                        />
                        <p style="font-size: 12px" class="text-content">
                          {{ $t('Used') }}
                        </p>
                      </div>
                    </div>
                  </v-img>
                </div>
              </div>
              <div>
                <v-avatar image="Flip.png" size="60px" />
                <p class="text-white mt-n2">{{ $t('Filp') }}</p>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- dialog use voucher -->
  <v-dialog
    v-model="isConfirmDialogOpen"
    content-class="elevation-0"
    max-width="30rem"
    opacity="0.8"
  >
    <div style="position: relative">
      <div
        style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          z-index: 1;
        "
      >
        <v-img src="icons/voucher.png" style="width: 30rem" />
      </div>
      <v-card
        rounded="xl"
        elevation="0"
        :style="{
          backgroundColor: colors['dialog-surface'],
          '-webkit-backdrop-filter': 'blur(15px)',
          'backdrop-filter': 'blur(15px)',
          position: 'relative',
          bottom: $vuetify.display.xs ? '10vh' : '13vh',
        }"
      >
        <div :style="{ 'height': $vuetify.display.xs ?  '5rem' : '8rem'}" />
        <v-card-text class="text-primary text-center">
          <h2>{{ $t('questionUse') }}</h2>
        </v-card-text>
        <v-card-actions class="mb-4 ">
          <v-spacer />
          <v-btn variant="plain" class="mx-2" @click="cancelUseVoucher()">
            {{ $t('Cancel') }}
          </v-btn>
          <v-btn
            rounded
            variant="flat"
            class="px-3 white--text"
            color="primary"
            @click="confirmAction(item)"
          >
            {{ $t('Confirm') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<style scoped>
.img-black {
  filter: invert(1) brightness(0);
}

.image-filter {
  filter: grayscale(10%) brightness(80%);
}

.flip-card {
  height: 450px;
  width: 100%;
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-front {
  color: white;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
