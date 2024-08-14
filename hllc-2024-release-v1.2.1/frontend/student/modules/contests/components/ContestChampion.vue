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
const { colors } = useSchool()
const { current } = useLocale()
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
      <v-img :src="item.coverImage" cover :aspect-ratio="3 / 4">
        <div class="d-flex justify-space-between">
          <v-avatar class="pa-1" size="60"> 
            <v-img src="../contests/champion.png" width="8rem"/>
          </v-avatar>
          <v-chip color="white" variant="flat" class="ma-2" elevation="0">
            <v-avatar class="pa-1 ml-n1" color="transparent">
              <v-img src="../contests/lamduan.png" />
            </v-avatar>
            <span class="ml-1">{{ item.votes || '0' }}</span>
          </v-chip>
        </div>
      </v-img>
      <v-card-text>
        <p class="text-title text-wrap">{{ item.title[lang] }}</p>
        <p class="text-content text-wrap">{{ item.team }}</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.text-wrap {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
