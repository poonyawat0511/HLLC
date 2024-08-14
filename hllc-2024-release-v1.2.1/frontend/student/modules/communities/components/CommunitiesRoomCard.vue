<script setup lang="ts">
import type { Socket } from 'socket.io-client'

interface Props {
  item: Room
}

const { fetchRooms } = useCommunity()

const props = defineProps<Props>()
const messages: Ref<any[]> = ref([])
const router = useRouter()
const { $api } = useNuxtApp()
const socket = inject<Socket>('socket')
const rooms: Ref<Room[]> = ref([])
const joinedRoom: Ref<string> = ref('')

const goToChatRoom = (roomName: string) => {
  router.push({ path: '/chats', query: { room: roomName } })
}

const joinRoom = (room: Room) => {
  if (socket) {
    socket.emit('joinRoom', { room: room })
    joinedRoom.value = room.id
    goToChatRoom(room.id)
  } else {
    console.error('Socket connection is not established.')
  }
}

onMounted(async () => {
  await fetchRooms()
})

watch(messages, async () => {
  await nextTick()
  const messageBox = document.querySelector('.message-box')
  if (messageBox) {
    messageBox.scrollTop = messageBox.scrollHeight
  }
})
type Locales = 'th' | 'en'
const { current } = useLocale()
const lang = computed<Locales>(() => current.value as Locales)
</script>

<template>
  <div>
    <v-card rounded="xl" elevation="0" variant="flat">
      {{ item }}
      <div class="d-flex">
        <v-img
          max-width="5rem"
          max-height="8rem"
          :src="item.roomImage"
          class="rounded-xl ml-3 mb-3 mt-3"
          cover
        />
        <div class="mt-2 ml-2">
          <div class="text-title title-line-clamp" style="font-size: 16px">
            {{ item.name[lang] }}
          </div>
          <div class="font-weight-medium text-content" style="font-size: 14px">
            สมาชิก : {{ item.people }} people
          </div>
        </div>
      </div>
      <v-card-actions class="mt-n10">
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          class="px-5"
          rounded
          elevation="0"
          @click="joinRoom(item)"
        >
          Joined
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.message-box {
  flex: 1;
  overflow-y: auto;
}

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
}

.message-text {
  color: black;
  font-size: 1em;
  font-weight: bold;
}

.timestamp {
  font-size: 0.7em;
  color: #888;
}

.connection-text {
  font-size: 0.9em;
  color: #ff8c00;
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
