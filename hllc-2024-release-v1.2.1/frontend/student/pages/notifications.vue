<script setup lang="ts">
definePageMeta({
  menu: {
    active: 'Notifications',
    display: true,
  },
  background: true,
})

// Injections
const router = useRouter()
const route = useRoute()
const { colors } = useSchool()
const { read, reads, unreads } = useNotification()

// Notification dialog
const selectedNotification = ref<NotificationEntity>()
const dialog = reactive<{ value: boolean; loading: boolean }>({
  value: false,
  loading: false,
})

const openDialog = async (notification: NotificationEntity) => {
  selectedNotification.value = notification
  dialog.value = true
  read(selectedNotification.value)
}

const onCloseDialog = async () => {
  dialog.value = false
}

interface TabItem {
  value: string
  title: { en: string; th: string }
}

const tabs = reactive<TabItem[]>([
  {
    value: 'unRead',
    title: {
      en: 'Unread',
      th: 'ยังไม่ได้อ่าน',
    },
  },
  {
    value: 'read',
    title: {
      en: 'Read',
      th: 'อ่านแล้ว',
    },
  },
])

function changeTab(value: string) {
  tab.value = value
}

const tab = computed<string>({
  get() {
    return route.query.view ? String(route.query.view) : tabs[0]?.value
  },
  set(value) {
    router.push({ query: { view: value } })
  },
})
</script>
<template>
  <ClientOnly>
    <v-container fluid>
      <h1 class="text-center text-white">{{ $t('Notifications') }}</h1>
      <tab-switch :tabs="tabs" :active-tab="tab" @change-tab="changeTab" />
      <v-window v-model="tab">
        <v-window-item value="unRead">
          <v-row dense class="mt-1">
            <template v-if="unreads.length">
              <v-col
                v-for="(notification, index) in unreads"
                :key="index"
                cols="12"
              >
                <notification-card
                  :item="notification"
                  @click="openDialog(notification)"
                />
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12">
                <v-card
                  :color="colors['card-surface']"
                  rounded="xl"
                  elevation="0"
                  class="py-4"
                >
                  <v-card-text class="text-center">
                    {{ $t('noNotification') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-window-item>
        <v-window-item value="read">
          <v-row dense class="mt-1">
            <template v-if="reads.length">
              <v-col
                v-for="(notification, index) in reads"
                :key="index"
                cols="12"
              >
                <notification-card
                  :item="notification"
                  @click="openDialog(notification)"
                />
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12">
                <v-card
                  :color="colors['card-surface']"
                  rounded="xl"
                  elevation="0"
                  class="py-4"
                >
                  <v-card-text class="text-center">
                    {{ $t('noNotification') }}
                  </v-card-text>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-window-item>
      </v-window>
      <notification-dialog
        v-if="selectedNotification"
        v-model="dialog.value"
        :loading="dialog.loading"
        :item="selectedNotification"
        @close="onCloseDialog"
      />
    </v-container>
  </ClientOnly>
</template>
