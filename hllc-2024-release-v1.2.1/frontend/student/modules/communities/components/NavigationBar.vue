<script setup lang="ts">
import { io } from 'socket.io-client'
const { data: user } = useAuth()
const { countFriendRequest, token, fetchFriendRequest } =
  useFetchFriendRequest()
const runtimeConfig = useRuntimeConfig()
const socketURL = runtimeConfig.public.socketURL
const dialog = ref(false)

const route = useRoute()

onMounted(() => {
  const socket = io(socketURL, {
    transports: ['websocket'],
    auth: { token: token.value },
  })
  socket.on('answerQue', async () => {
    fetchFriendRequest()
  })

  // Check the query parameter and open the dialog if true
  const query = route.fullPath.split('?')[1]
  if (query === '=true' || query === 'true') {
    dialog.value = true
  }
})

const openDialog = () => {
  dialog.value = true
}

const router = useRouter()
</script>

<template>
  <v-toolbar
    v-if="user.type == 'TESTER'"
    color="transparent"
    flat
    class="mt-n2"
  >
    <v-btn
      color="primary"
      rounded
      variant="flat"
      prepend-icon="mdi-arrow-left-circle-outline"
      :text="$t('goBack')"
      @click="router.push('/communities')"
    />
    <v-spacer />
    <v-chip color="primary" rounded variant="flat" @click="openDialog()">
      <span>{{ $t('friendRequests') }}</span>
    </v-chip>
    <v-badge
      v-if="countFriendRequest > 0"
      color="red"
      :content="countFriendRequest"
      class="mr-3 ml-n1 mt-n7"
    />
    <div v-else class="mr-2" />
    <v-chip
      color="primary"
      rounded="xl"
      variant="flat"
      @click="router.push('/communities/scan')"
    >
      <v-icon>mdi-qrcode-scan</v-icon>
    </v-chip>
  </v-toolbar>
  <communities-request-dialog v-model="dialog" />
</template>
