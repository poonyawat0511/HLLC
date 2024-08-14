<script setup lang="ts">
const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)

interface Props {
  item: VoucherCode
}
const props = defineProps<Props>()
defineEmits<{
  'click:pick': [value: VoucherCode]
}>()

const isExp = computed(() => {
  const currentTime = new Date()
  if (!props.item?.voucher.exp) {
    return false
  }
  return currentTime >= new Date(props.item?.voucher.exp)
})
</script>
<template>
  <div>
    <div v-if="item.type == 'UNUSED' && !isExp">
      <v-img :src="item.voucher.voucherImages.main" height="175px" />
    </div>
    <div v-else class="image-container">
      <v-img :src="item.voucher.voucherImages.main" class="image-filter"></v-img>
      <div class="centered-text">
        <div class="mx-auto" style="width: 6rem">
          <v-responsive width='10vh' class="mx-auto">
            <v-img src="hllc/SD.png"></v-img>
          </v-responsive>
          <p
            v-if="item.type == 'UNUSED' && isExp"
            class="text-white text-content text-center"
            style="font-size: 10px"
          >
            {{ $t('isExp') }}
          </p>
          <p
            v-else
            style="font-size: 10px"
            class="text-white text-content text-center"
          >
            {{ $t('Used') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.image-filter {
  filter: grayscale(10%) brightness(50%);
  width: 100%;
  height: auto;
}
.centered-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-22%, -45%);
  text-align: center;
  width: 100%;
}
</style>
