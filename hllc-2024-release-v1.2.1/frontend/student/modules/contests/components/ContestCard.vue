<script setup lang="ts">
interface Props {
  item: Contest
}
type Events = {
  click: [value: Contest]
}
defineProps<Props>()
defineEmits<Events>()

type Locales = 'th' | 'en'
const { current } = useLocale()
const { colors } = useSchool()
const lang = computed<Locales>(() => current.value as Locales)
</script>

<template>
  <div>
    <v-card
      rounded="xl"
      :color="colors['card-surface']"
      elevation="0"
      border
      @click="$emit('click', item)"
    >
      <v-row dense>
        <v-col cols="4">
          <v-img
            :src="item?.coverImage"
            class="rounded-xl ml-3 mb-3 mt-3"
            cover
            :aspect-ratio="3 / 4"
          />
        </v-col>
        <v-col cols="8">
          <v-card-title class="text-h5">
            <span class="text-title title-line-clamp">
              {{ item?.title[lang] }}
            </span>
          </v-card-title>

          <v-card-subtitle class="font-weight-bold text-subtitle  mt-n3"
            >{{ $t('Category') }}: {{ item?.category[lang] }}</v-card-subtitle
          >
          <v-card-text class="font-weight-meduim text-content mt-n3">
            <p class="contest-description">
              {{ $t('Description') }}:
              {{ item?.description[lang] }}
            </p>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions
        style="position: absolute; bottom: 0rem; width: 100%"
        class="mb-n1"
      >
        <v-spacer />
        <v-chip color="white" variant="flat" class="ma-2 px-5" elevation="0">
          <v-avatar class="pa-1 ml-n1" color="transparent">
            <v-img src="../contests/lamduan.png" />
          </v-avatar>
          <span class="ml-1 text-content">{{ item.votes || '0' }}</span>
        </v-chip>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.title-line-clamp {
  -webkit-line-clamp: 1; 
  line-clamp: 1; 
  overflow: hidden;
}
.subtitle-line-clamp {
  display: -webkit-box;
  display: flex;
  -webkit-line-clamp: 2; 
  line-clamp: 2; 
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.contest-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
