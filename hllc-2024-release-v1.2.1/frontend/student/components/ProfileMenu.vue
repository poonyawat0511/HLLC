<script setup lang="ts">
import { useDisplay } from 'vuetify'

interface Props {
  nav?: boolean
  contentClass?: Array<string> | string | Record<string, boolean>
}

const props = withDefaults(defineProps<Props>(), {
  contentClass: 'pa-1',
  nav: true,
})

const { colors, avatars } = useSchool()
const { currentLevel } = useEvolution()
const menu = ref(false)
const { data: user } = useAuth()
const { xs } = useDisplay()
const openDialogLogout = ref(false)
const router = useRouter()
const avatarError = ref(false)

const avatar = computed(() => {
  return avatars[currentLevel.value as 1 | 2 | 3 | 4]
})

const goToProfile = () => {
  if (!props.nav) return
  router.push('/profile')
  menu.value = false
}
</script>
<template>
  <v-menu
    v-model="menu"
    nudge-bottom="15"
    nudge-width="100"
    offset-y
    rounded="lg"
    max-width="300"
  >
    <template #activator="{ props: activator }">
      <v-btn
        variant="flat"
        color="primary"
        class="mr-3"
        rounded
        style="border: 1px solid #ffffff"
        v-bind="{ ...activator, ...$attrs }"
      >
        <v-avatar size="25" class="mr-0 mr-sm-2 ml-0 ml-n2">
          <v-icon color="bottom-bg" icon="mdi-account" />
        </v-avatar>
        <ClientOnly>
          <span v-if="!xs" class="text-bottom-bg">
            {{ user?.fullName || 'User' }}
          </span>
        </ClientOnly>
        <v-icon large color="bottom-bg" class="ml-0 ml-sm-2 mr-n2 mr-sm-0">
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>

    <v-card
      :class="contentClass"
      rounded="xl"
      elevation="0"
      :color="colors['card-surface']"
      class="mt-2"
    >
      <slot>
        <v-list-item
          dense
          lines="three"
          class="rounded-xl"
          style="background-color: transparent"
          @click="goToProfile()"
        >
          <template #prepend>
            <v-avatar class="pa-1" size="large">
              <v-img
                :src="avatarError ? 'mystery-egg.png' : avatar"
                @error="avatarError = true"
              />
            </v-avatar>
          </template>
          <v-list-item-title class="text-title text-detail">
            {{ user?.fullName || 'User' }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-content text-detail">
            {{ $t('studentId') }}{{ user?.username || 'No login' }}
          </v-list-item-subtitle>
          <v-list-item-subtitle class="text-content text-detail">
            {{ $t('Major') }}:
            {{ user.major.name[$i18n.locale] || 'Please login' }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-divider class="mt-1" />
        <v-card-actions @click.stop>
          <v-spacer />
          <v-btn
            block
            rounded
            color="error"
            variant="flat"
            @click="openDialogLogout = true"
          >
            {{ $t('logout.title') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </slot>
    </v-card>
  </v-menu>

  <logout-dialog v-model="openDialogLogout" />
</template>
<style scoped>
.text-detail {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>
