<script setup lang="ts">
const { data: user } = useAuth()
const { colors, avatars } = useSchool()
const { currentLevel } = useEvolution()
const { mdAndUp } = useDisplay()
const { current } = useLocale()
const { t } = useI18n()

type Locales = 'th' | 'en'

definePageMeta({
  background: true,
  menu: {
    display: true,
  },
})

const lang = computed(() => current.value as Locales)

const reportDialog = ref(false)
const openDialogLogout = ref(false)
const avatarError = ref(false)

const avatar = computed(() => {
  return avatars[currentLevel.value as 1 | 2 | 3 | 4]
})

const items = computed(() => [
  {
    title: t('profile.name'),
    value: user.value.fullName,
    icon: user.value.theme?.assets.username,
  },
  {
    title: t('profile.studentId'),
    value: user.value.username,
    icon: user.value.theme?.assets.studentId,
  },
  {
    title: t('profile.school'),
    value: user.value.major?.school?.name?.[lang.value],
    icon: user.value.theme?.assets.school,
  },
  {
    title: t('profile.major'),
    value: user.value.major?.name?.[lang.value],
    icon: user.value.theme?.assets.major,
  },
])
</script>

<template>
  <v-container fluid>
    <div
      style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      "
    >
      <!-- avatar -->
      <div
        style="
          position: relative;
          border-radius: 90%;
          background-color: #ffffff2c;
          width: 20rem;
          height: 20rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          z-index: 1;
        "
      >
        <img
          :src="avatarError ? 'mystery-egg.png' : avatar"
          style="top: 25vh; padding-bottom: 15%; width: 12rem"
          :onerror="() => (avatarError = true)"
        >
        <v-sheet
          color="primary"
          style="
            position: relative;
            border-radius: 80%;
            opacity: 0.5;
            width: 6rem;
            height: 1.3rem;
            bottom: 2.5rem;
            filter: blur(3px);
          "
        />
      </div>
      <!-- detail -->
      <v-card
        rounded="xl"
        :color="colors['card-surface']"
        class="mx-auto"
        elevation="0"
        style="position: relative; bottom: 7vh"
        width="100%"
      >
        <v-card-text class="mt-5">
          <v-list style="background-color: transparent">
            <div v-for="item in items" :key="item.title">
              <v-list-item>
                <template #prepend>
                  <v-avatar color="transparent" tile rounded="lg">
                    <v-img :src="item.icon" />
                  </v-avatar>
                </template>
                <template #title>
                  <h4 class="text-title">{{ item.title }}</h4>
                </template>
                <template #subtitle>
                  <p class="font-weight-bold text-content">
                    {{ item.value }}
                  </p>
                </template>
              </v-list-item>
              <v-divider class="mt-2" />
            </div>
          </v-list>
        </v-card-text>
        <v-card-actions class="mt-n2">
          <v-spacer />
          <div class="d-flex flex-colomn justify-center">
            <v-btn
              class="ml-2 px-4"
              :width="mdAndUp ? '20rem' : '8rem'"
              variant="flat"
              color="white"
              prepend-icon="mdi-information-slab-circle-outline"
              rounded
              @click="reportDialog = true"
            >
              {{ $t('report.title') }}
            </v-btn>
            <v-btn
              color="error"
              variant="flat"
              prepend-icon="mdi-logout"
              rounded
              :width="mdAndUp ? '20rem' : '8rem'"
              class="ml-2 px-4"
              @click="openDialogLogout = true"
            >
              {{ $t('logout.title') }}
            </v-btn>
          </div>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </div>
    <ReportDialog v-model="reportDialog" />
    <LogoutDialog v-model="openDialogLogout" />
  </v-container>
</template>
