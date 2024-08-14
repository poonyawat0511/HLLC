<template>
  <v-container>
    <v-btn color="primary" @click="openCreateDialog">Create Sticker</v-btn>

    <v-dialog v-model="createDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Sticker</span>
        </v-card-title>
        <v-card-subtitle>
          <v-form @submit.prevent="createSticker">
            <v-text-field
              v-model="newSticker.name.th"
              label="Sticker Name (TH)"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              v-model="newSticker.name.en"
              label="Sticker Name (EN)"
              variant="outlined"
              required
            ></v-text-field>
            <base-image-upload
              v-model="newSticker.sticker"
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

    <v-dialog v-model="updateDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Sticker</span>
        </v-card-title>
        <v-card-subtitle>
          <v-form @submit.prevent="updateSticker">
            <v-text-field
              v-model="currentSticker.name.th"
              label="Sticker Name (TH)"
              variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              v-model="currentSticker.name.en"
              label="Sticker Name (EN)"
              variant="outlined"
              required
            ></v-text-field>
            <base-image-upload
              v-model="currentSticker.sticker"
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

    <!-- List of stickers -->
    <v-row class="mt-3">
      <v-col
        v-for="sticker in stickers"
        :key="sticker.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card elevation="5">
          <v-img
            :src="sticker.sticker"
            cover
            aspect-ratio="1 / 1"
            height="150px"
            width="150px"
            class="mx-auto mt-3 elevation-2"
          ></v-img>
            <v-card-title>{{ sticker.name.th }} ({{ sticker.name.en }})</v-card-title>
          <v-card-actions class="justify-center">
            <v-btn @click.stop="openUpdateDialog(sticker)" variant="flat" color="blue" class="rounded-lg">Edit</v-btn>
            <v-btn @click.stop="deleteSticker(sticker.id)" variant="flat" color="red" class="rounded-lg">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col v-if="stickers.length === 0" cols="12">
        <v-card>
          <v-card-title>No stickers available</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const apiUrl = 'http://localhost:8080/api/stickers'

const stickers = ref<any[]>([])
const currentSticker = ref<{
  id?: string
  name: { th: string; en: string }
  sticker?: File
}>({
  name: { th: '', en: '' },
})
const newSticker = ref<{
  name: { th: string; en: string }
  sticker?: string | File
}>({
  name: { th: '', en: '' },
})
const createDialog = ref(false)
const updateDialog = ref(false)

const fetchStickers = async () => {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    stickers.value = data.data
  } catch (error) {
    console.error('Error fetching stickers:', error)
  }
}

const createSticker = async () => {
  try {
    const formData = new FormData()
    formData.append('name[th]', newSticker.value.name.th)
    formData.append('name[en]', newSticker.value.name.en)
    formData.append('sticker', newSticker.value.sticker!)

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Error creating sticker: ${response.statusText}, ${errorText}`
      )
      throw new Error(`Error creating sticker: ${response.statusText}`)
    }

    newSticker.value = { name: { th: '', en: '' } } // Reset form
    closeCreateDialog()
    fetchStickers()
  } catch (error) {
    console.error('Error creating sticker:', error)
  }
}

const updateSticker = async () => {
  try {
    if (!currentSticker.value.id) {
      throw new Error('Sticker ID is required for updating.')
    }

    const formData = new FormData()
    formData.append('name[th]', currentSticker.value.name.th)
    formData.append('name[en]', currentSticker.value.name.en)
    if (currentSticker.value.sticker instanceof File) {
      formData.append('sticker', currentSticker.value.sticker)
    }

    const response = await fetch(`${apiUrl}/${currentSticker.value.id}`, {
      method: 'PATCH',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Error updating sticker: ${response.statusText}, ${errorText}`
      )
      throw new Error(`Error updating sticker: ${response.statusText}`)
    }

    currentSticker.value = { name: { th: '', en: '' } } // Reset form
    closeUpdateDialog()
    fetchStickers()
  } catch (error) {
    console.error('Error updating sticker:', error)
  }
}

const openCreateDialog = () => {
  createDialog.value = true
}

const closeCreateDialog = () => {
  createDialog.value = false
  newSticker.value = { name: { th: '', en: '' } } // Reset form when closing dialog
}

const openUpdateDialog = (selectedSticker: any) => {
  currentSticker.value = { ...selectedSticker }
  updateDialog.value = true
}

const closeUpdateDialog = () => {
  updateDialog.value = false
  currentSticker.value = { name: { th: '', en: '' } } // Reset form when closing dialog
}

const deleteSticker = async (id: string) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(`Error deleting Sticker: ${response.statusText}`)
    }
    fetchStickers()
  } catch (error) {
    console.error('Error deleting Sticker:', error)
  }
}

onMounted(() => {
  fetchStickers()
})
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
}
</style>
