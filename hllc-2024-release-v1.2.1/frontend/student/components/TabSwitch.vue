<template>
  <v-card color="transparent" elevation="0">
    <v-card-actions>
      <v-spacer />
      <v-card :color="colors['card-surface']" outlined tile flat rounded="xl" class="mb-n2">
        <v-card-actions>
          <v-btn
            v-for="item in tabs"
            :key="item.value"
            rounded
            :color="activeTab === item.value ? 'primary' : 'transparent'"
            variant="flat"
            dark
            class="px-2"
            @click="changeTab(item)"
          >
            <h5
              :style="{ color: activeTab === item.value ? '' : 'text-content' }"
              class="ml-2 mr-2"
            >
              {{ item.title[lang] }}
            </h5>
          </v-btn>
          <v-spacer/>
        </v-card-actions>
      </v-card>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const { colors } = useSchool()
interface TabItem {
  value: string;
  title: { en: string; th: string }
}
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
const props = defineProps<{
  tabs: TabItem[];
  activeTab?: string;
}>();

const emit = defineEmits(['change-tab']);

function changeTab(item: TabItem) {
  emit('change-tab', item.value);
}
</script>
