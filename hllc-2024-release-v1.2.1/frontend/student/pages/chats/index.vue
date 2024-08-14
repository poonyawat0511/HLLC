<template>
  <v-container v-if="user.type == 'TESTER'" fluid>
    <v-btn
      size="small"
      color="primary"
      prepend-icon="mdi-arrow-left"
      rounded
      elevation="0"
      @click="BackToRoomList"
    >
      ออกจากห้อง
    </v-btn>
    <v-card
      :color="colors['card-bg']"
      rounded="xl"
      varaint="outlined"
      elevation="0"
      class="mt-2 border"
      h
    >
      <v-card-title class="bg-primary d-flex">
        <v-spacer />
        Name of community (50/100)
        <v-spacer />
      </v-card-title>
      <v-card-text>
        <v-responsive class="overflow-y-auto" height="60vh">
          <div class="d-flew flex-column-reverse">
            <div v-for="(message, index) in messages" :key="index">
              <div
                v-if="message.isConnectionMessage"
                class="d-flex justify-center mt-3"
              >
                {{ message.text }}
              </div>
              <div
                v-if="message.sentByMe"
                class="d-flex flex-row justify-end align-start my-2"
              >
                <div class="d-flex flex-column justify-end align-end">
                  <div>
                    <v-card
                      rounded="lg"
                      class="pa-2 rounded-tr-0"
                      color="primary"
                      elevation="0"
                      max-width="40vw"
                      dark
                    >
                      <span v-if="!message.isStickerMessage">{{
                        message.text
                      }}</span>
                      <v-img v-else :src="message.stickerSrc" width="6rem" />
                    </v-card>
                    <span class="mr-1" style="font-size: 10px">
                      {{ message.timestamp }}
                    </span>
                  </div>
                </div>
                <v-avatar size="30" class="mt-1 ml-2" color="primary">
                  <v-icon icon="mdi-account"
                /></v-avatar>
              </div>
              <div
                v-if="!message.sentByMe === !message.isConnectionMessage"
                class="d-flex flex-row justify-start align-start my-2"
              >
                <v-avatar size="30" color="grey" class="mt-1">
                  <v-icon icon="mdi-account" color="white"
                /></v-avatar>
                <div class="d-flex flex-column justify-end ml-2">
                  <div>
                    <v-card
                      rounded="lg"
                      class="pa-2 rounded-tl-0"
                      max-width="40vw"
                      elevation="0"
                    >
                      <span v-if="!message.isStickerMessage">{{
                        message.text
                      }}</span>
                      <v-img v-else :src="message.stickerSrc" width="6rem" />
                    </v-card>
                    <span class="ml-1" style="font-size: 10px">
                      {{ message.timestamp }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-responsive>
        <div ref="chatContent" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-text-field
          v-model="newMessage"
          rounded
          density="compact"
          variant="flat"
          hide-details
          base-color="primary"
          bg-color="white"
          color="primary"
          single-line
          label="Send Message...."
          append-inner-icon="mdi-send"
          @keyup.enter="sendMessage"
          @click:append-inner="sendMessage"
        />
        <v-avatar
          class="ma-1 ml-3"
          color="primary"
          size="38px"
          @click="showStickerPicker = !showStickerPicker"
        >
          <v-icon color="white" icon="mdi-emoticon-outline" />
        </v-avatar>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="showStickerPicker" max-width="30rem" persistent>
      <v-card rounded="xl" elevation="0" :color="colors['dialog-surface']">
        <v-card-title class="text-center">Choose a Sticker</v-card-title>
        <v-divider />
        <v-card-text>
          <v-row dense>
            <v-col
              v-for="sticker in stickers"
              :key="sticker.id"
              cols="4"
              md="3"
            >
              <v-img
                :src="sticker.sticker"
                class="sticker"
                @click="sendSticker(sticker.id)"
              />
            </v-col>
            <v-col v-if="stickers.length === 0" cols="12" class="text-center">
              {{ $t('noData') }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="px-5"
            variant="flat"
            rounded
            color="primary"
            @click="showStickerPicker = false"
          >
            {{ $t('isClose') }}
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import type { Socket } from 'socket.io-client'
import io from 'socket.io-client'
definePageMeta({
  menu: {
    display: false,
  },
  background: true,
})

const route = useRoute()
const id = route.params.id as string
const socket = inject<Socket>('socket')
const { data: user, token } = useAuth()
const yourAccessToken = token.value
const { colors } = useSchool()
const router = useRouter()
const { $api } = useNuxtApp()
const messages = ref<any[]>([])
const newMessage = ref<string>('')
const currentRoom = ref<string>('')
const stickers = ref<any[]>([])
const showStickerPicker = ref<boolean>(false)

const { room, fetchRoom } = useCommunity()

onMounted(() => {
  console.log('id',id)

  fetchRoom(id)

  if (!socket) {
    console.error('Socket not initialized')
    return
  }

  socket.value = io('http://localhost:8080', {
    query: {
      userId: user?.id,
    },
    auth: {
      token: `${yourAccessToken}`,
    },
    transports: ['websocket', 'polling'],
  })

  socket.value?.on('connect', () => {
    console.log('Connected with socket id:', socket.value?.id)
  })

  socket.value?.on('disconnect', () => {
    console.log('Disconnected from socket')
  })

  socket.value?.on('onMessage', (data) => {
    console.log(`Received message from ${data.username}: ${data.text}`)
    handleIncomingMessage(data)
  })

  socket.value?.on('onSticker', (data: any) => {
    console.log(
      `Received new sticker from ${data.username} with ID: ${data.stickerId}`
    )
    handleIncomingSticker(data)
  })

  socket.value?.on('onUserJoin', (data: any) => {
    console.log('User joined:', data)
    handleUserJoin(data)
  })

  socket.value?.on('onUserLeave', (data: any) => {
    console.log('User left:', data)
    handleUserLeave(data)
  })

  $api
    .get('/stickers')
    .then((response: any) => {
      stickers.value = response.data
      console.log('Stickers fetched:', stickers.value)
    })
    .catch((error: any) => {
      console.error('Error fetching stickers:', error)
    })

  const roomName = route.query.room as string
  if (roomName) {
    currentRoom.value = roomName
    socket.value?.emit('joinRoom', roomName)
  }
})

const sendMessage = () => {
  if (newMessage.value.trim() !== '' && currentRoom.value) {
    const messageData = {
      text: newMessage.value,
      room: currentRoom.value,
      username: user?.username,
      timestamp: new Date().toLocaleTimeString(),
      isStickerMessage: false,
    }

    socket.value?.emit('newMessage', messageData)

    messages.value.push({
      ...messageData,
      sentByMe: true,
    })

    newMessage.value = ''
  }
}

const handleIncomingMessage = async (message: any) => {
  const newMsg = {
    username: message.username,
    text: message.text,
    timestamp: new Date().toLocaleTimeString(),
    sentByMe: message.username === user?.username,
    isStickerMessage: message.isStickerMessage,
  }

  messages.value.push(newMsg)

  await nextTick()
}

const sendSticker = (stickerId: string) => {
  console.log('Attempting to send sticker with ID:', stickerId)

  socket.value?.emit('newSticker', {
    stickerId,
    username: user.username,
    room: currentRoom.value,
  })

  const sticker = {
    id: stickerId,
    username: user.username,
    isStickerMessage: true,
    stickerSrc:
      stickers.value.find((s: any) => s.id === stickerId)?.sticker || '',
    sentByMe: true,
  }
  messages.value.push(sticker)

  showStickerPicker.value = false
}

const handleIncomingSticker = (data: any) => {
  console.log('Received sticker data:', data)

  const foundSticker = stickers.value.find((s: any) => s.id === data.stickerId)
  console.log('Found sticker object:', foundSticker)

  const sticker = {
    id: data.stickerId,
    username: data.username,
    isStickerMessage: true,
    stickerSrc: foundSticker ? foundSticker.sticker : '',
    sentByMe: false,
  }
  console.log('Processed sticker message:', sticker)
  messages.value.push(sticker)
}

const handleUserJoin = (data: any) => {
  const joinMessage = {
    username: data.username,
    text: `${data.username} has joined the room.`,
    timestamp: new Date().toLocaleTimeString(),
    sentByMe: false,
    isConnectionMessage: true,
  }
  messages.value.push(joinMessage)
}

const handleUserLeave = (data: any) => {
  const leaveMessage = {
    username: data.username,
    text: `${data.username} has left the room.`,
    timestamp: new Date().toLocaleTimeString(),
    sentByMe: false,
    isConnectionMessage: true,
  }
  messages.value.push(leaveMessage)
}

const BackToRoomList = () => {
  if (socket.value) {
    // Emit leaveRoom event with the current room
    socket.value.emit('leaveRoom', currentRoom.value, (ack: any) => {
      if (ack.error) {
        console.error('Error leaving room:', ack.error)
      } else {
        console.log('Left room successfully:', ack)
      }
    })

    // Properly disconnect the socket
    socket.value.disconnect()
    console.log('Socket disconnected')

    // Set the socket reference to null to avoid reconnection attempts
    socket.value = null
  }
  currentRoom.value = ''
  messages.value = []
  router.push('/communities')
}
</script>

<style scoped>
.room-controls-container {
  transition: width 0.3s ease;
}

.chat-box-container {
  transition: width 0.3s ease;
}

.room-controls {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.sent-message {
  justify-content: flex-end;
  text-align: right;
  background-color: #e6ffe6;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 4px;
}

.received-message {
  justify-content: flex-start;
  text-align: left;
  background-color: #f2f2f2;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 4px;
}

.connection-message {
  justify-content: center;
  text-align: center;
  background-color: #fff0e6;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 4px;
}

.username {
  font-weight: normal;
  font-size: 0.8em;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 4px;
  background-color: #f9f9f9;
}

.timestamp {
  font-size: 0.7em;
  color: #888;
}

.message-text {
  color: black;
  font-size: 1em;
  font-weight: bold;
}

.connection-text {
  font-size: 0.9em;
  color: #c0dee6;
  font-weight: bold;
}

.connection-message {
  background-color: #f0f8ff;
  color: #333;
  font-style: italic;
  text-align: center;
}

.sticker-image {
  width: 100px;
  height: 100px;
  margin: 10px;
}
</style>
