<script setup lang="ts">
const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)

interface Props {
  item: voucherExists
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
})

defineEmits<{
  'click:pick': [value: voucherExists]
}>()
</script>
<template>
  <div >
    <div @click="$emit('click:pick', item)" >
      <v-img :src="item.voucher.voucherImages.main"></v-img>
    </div>
  </div>
</template>