<template>
  <v-container>
    <!-- Button to open the create dialog -->
    <v-btn color="primary" @click="openCreateDialog">Create Room</v-btn>

    <!-- Dialog for creating a room -->
    <v-dialog v-model="createDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Room</span>
        </v-card-title>
        <v-card-subtitle>
          <v-form @submit.prevent="createRoom">
            <v-text-field
              v-model="newRoom.name.th"
              label="Room Name (TH)"
              variant="outlined"
              required
            />
            <v-text-field
              v-model="newRoom.name.en"
              label="Room Name (EN)"
              variant="outlined"
              required
            />
            <v-text-field
              v-model="newRoom.people"
              label="Number of People"
              type="string"
              variant="outlined"
              required
            />
            <base-image-upload
              v-model="newRoom.roomImage"
              :aspect-ratio="1 / 1"
              color="black"
            />
            <v-card-actions>
              <v-btn text @click="closeCreateDialog">Cancel</v-btn>
              <v-btn type="submit" color="primary">Create</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- Dialog for updating a room -->
    <v-dialog v-model="updateDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Room</span>
        </v-card-title>
        <v-card-subtitle>
          <v-form @submit.prevent="updateRoom">
            <v-text-field
              v-model="room.name.th"
              label="Room Name (TH)"
              variant="outlined"
              required
            />
            <v-text-field
              v-model="room.name.en"
              label="Room Name (EN)"
              variant="outlined"
              required
            />
            <v-text-field
              v-model="room.people"
              label="Number of People"
              variant="outlined"
              type="string"
              required
            />
            <base-image-upload
              v-model="room.roomImage"
              :aspect-ratio="1 / 1"
              color="black"
            />
            <v-card-actions>
              <v-btn text @click="closeUpdateDialog">Cancel</v-btn>
              <v-btn type="submit" color="primary">Update</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-subtitle>
      </v-card>
    </v-dialog>

    <!-- List of rooms -->
    <v-row class="mt-2">
      <v-col
        v-for="room in rooms"
        :key="room.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card elevation="5" >
          <v-img
            :src="room.roomImage"
            cover
            aspect-ratio="1 / 1"
            height="200px"
            width="200px"
            class="mx-auto mt-3 elevation-2"
          />
          <v-card-title>{{ room.name.th }} ({{ room.name.en }})</v-card-title>
          <v-card-subtitle>People: {{ room.people }}</v-card-subtitle>
          <v-card-actions class="justify-center">
            <v-btn variant="flat" color="blue" class="rounded-lg" @click.stop="openUpdateDialog(room)">Edit</v-btn>
            <v-btn variant="flat" color="red" class="rounded-lg" @click.stop="deleteRoom(room.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="rooms.length === 0" cols="12">
        <v-card>
          <v-card-title>No rooms available</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const apiUrl = 'http://localhost:8080/api/rooms'

const rooms = ref<any[]>([])
const room = ref<{
  id?: string
  name: { th: string; en: string }
  people: string
  roomImage?: string | File
}>({
  name: { th: '', en: '' },
  people: '',
})
const newRoom = ref<{
  name: { th: string; en: string }
  people: string
  roomImage?: File
}>({
  name: { th: '', en: '' },
  people: '',
})
const createDialog = ref(false)
const updateDialog = ref(false)

const fetchRooms = async () => {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    rooms.value = data.data // Adjust based on your response structure
  } catch (error) {
    console.error('Error fetching rooms:', error)
  }
}

const createRoom = async () => {
  try {
    const formData = new FormData()
    formData.append('name[th]', newRoom.value.name.th)
    formData.append('name[en]', newRoom.value.name.en)
    formData.append('people', newRoom.value.people)
    formData.append('roomImage', newRoom.value.roomImage!)

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error creating room: ${response.statusText}, ${errorText}`)
      throw new Error(`Error creating room: ${response.statusText}`)
    }

    newRoom.value = { name: { th: '', en: '' }, people: '' } // Reset form
    closeCreateDialog()
    fetchRooms() // Refresh the room list
  } catch (error) {
    console.error('Error creating room:', error)
  }
}

const updateRoom = async () => {
  try {
    if (!room.value.id) {
      throw new Error('Room ID is required for updating.')
    }

    const formData = new FormData()
    formData.append('name[th]', room.value.name.th)
    formData.append('name[en]', room.value.name.en)
    formData.append('people', room.value.people)
    if (room.value.roomImage) {
      formData.append('roomImage', room.value.roomImage!)
    }

    const response = await fetch(`${apiUrl}/${room.value.id}`, {
      method: 'PATCH',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error updating room: ${response.statusText}, ${errorText}`)
      throw new Error(`Error updating room: ${response.statusText}`)
    }

    room.value = { name: { th: '', en: '' }, people: '' } // Reset form
    closeUpdateDialog()
    fetchRooms() // Refresh the room list
  } catch (error) {
    console.error('Error updating room:', error)
  }
}

const openCreateDialog = () => {
  createDialog.value = true
}

const closeCreateDialog = () => {
  createDialog.value = false
  newRoom.value = { name: { th: '', en: '' }, people: '' } // Reset form when closing dialog
}

const openUpdateDialog = (selectedRoom: any) => {
  room.value = { ...selectedRoom }
  updateDialog.value = true
}

const closeUpdateDialog = () => {
  updateDialog.value = false
  room.value = { name: { th: '', en: '' }, people: '' } // Reset form when closing dialog
}

const deleteRoom = async (id: string) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`Error deleting room: ${response.statusText}`)
    }
    fetchRooms() // Refresh the room list
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}

onMounted(() => {
  fetchRooms()
})
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
