<script setup lang="ts">
interface Props {
  item: IQuestion
}

type Events = {
  click: [value: IQuestion]
}

defineProps<Props>()
defineEmits<Events>()

const { colors } = useSchool()
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>
<template>
  <div>
    <v-card rounded="xl" elevation="0" :color="colors['card-surface']">
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-row dense>
          <v-col cols="7" sm="7">
            <v-card-title class="text-title" style="font-size:16px;">
              {{ item?.title[lang] }}
            </v-card-title>

            <v-card-text class="mt-n2 ">
              <span class="text-primary contest-description"  style="font-size: 15px">
                {{ item?.text[lang] }}
              </span>
            </v-card-text>
            <v-card-actions class="mt-n1">
              <v-btn
                class="ml-2 px-4"
                rounded
                :size="$vuetify.display.xs ? 'small' : 'large'"
                color="primary"
                :text="$t('goQuestion')"
                variant="flat"
                @click="$emit('click', item)"
              />
            </v-card-actions>
          </v-col>
          <v-col cols="5">
            <div class="d-flex justify-end">
              <v-avatar class="ma-3" rounded="0" size="125">
              <v-img :src="item?.image"></v-img>
            </v-avatar>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.contest-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>