<script setup lang="ts">
import { useDisplay } from 'vuetify'

const menu = ref(false)
const dialog = ref(false)

const { data: user } = useAuth()

const { contentClass } = defineProps({
  contentClass: {
    type: [Array<string>, String, Object],
    default: 'pa-1 mt-1',
  },
})

const profileImage = '/logo-sdad.png'

const { xs } = useDisplay()
</script>

<template>
  <v-menu v-model="menu" bottom left offset-y rounded="lg" max-width="300">
    <template #activator="{ props }">
      <ClientOnly>
        <v-btn large rounded elevation="0" small v-bind="props">
          <!-- Avatar -->
          <v-avatar color="transparent" class="ml-n3 mr-sm-3" size="30" dark>
            <v-img :src="profileImage" />
          </v-avatar>
          <span v-if="!xs">
            {{ user?.fullName || 'Admin' }}
          </span>
          <v-icon right class="ml-2"> mdi-menu-down </v-icon>
        </v-btn>
      </ClientOnly>
    </template>
    <v-card rounded="lg" :class="contentClass">
      <slot name="content" user="user">
        <v-list>
          <v-list-item>
            <template #prepend>
              <v-avatar>
                <v-img :src="profileImage" />
              </v-avatar>
            </template>
            <v-list-item-title>
              <v-responsive min-width="10rem">
                {{ user?.fullName || 'Admin' }}
              </v-responsive>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </slot>
      <v-divider />
      <slot name="append">
        <v-card-actions>
          <v-btn
            block
            rounded
            variant="elevated"
            color="error"
            @click.stop="dialog = true"
          >
            <v-icon left> mdi-logout-variant </v-icon>
            Logout
          </v-btn>
          <logout-dialog v-model="dialog" />
        </v-card-actions>
      </slot>
    </v-card>
  </v-menu>
</template>
