<script setup lang="ts">
const dialog = defineModel({ type: Boolean, default: false })
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})

const { friendRequest, deleteReq } = useFetchFriendRequest()
const { colors } = useSchool()
const { fetchRelationShip } = useFetchFriend()

interface FriendRequest {
  id?: string
  sender: User
  receiver: User
  questions: {
    questionnaire: Questionnaire
    answer: string
    messages: string
  }[]
}

const dialogShowDetails = ref(false)
const dataRequest = ref<FriendRequest>()
const dialogConfirms = ref(false)

const acceptFriendRequest = (request: FriendRequest) => {
  dialogShowDetails.value = true
  dataRequest.value = request
}

const rejectFriendRequest = (request: FriendRequest) => {
  dialogConfirms.value = true
  dataRequest.value = request
}

watch(dialog, async (value) => {
  if (value) {
    await fetchRelationShip()
  }
})
</script>

<template>
  <div>
    <v-dialog
      v-model="dialog"
      content-class="elevation-0"
      persistent
      transition="dialog-bottom-transition"
      fullscreen
      scrollable
    >
      <v-card
        style="position: relative; top: 9rem"
        rounded="xl"
        :color="colors['card-surface']"
        elevation="0"
      >
        <v-card-title class="d-flex align-center text-title">
          <v-icon size="25" class="mr-2" @click="dialog = false"
            >mdi-close</v-icon
          >
          <div class="flex-grow-1 text-center">Friend Requests</div>
        </v-card-title>
        <v-divider />
        <v-responsive class="overflow-y-auto" height="60vh">
          <v-row dense>
            <v-col
              v-for="(item, index) in friendRequest"
              :key="index"
              cols="12"
            >
              <v-card class="mb-2" variant="flat">
                <v-card-text>
                  <div class="d-flex">
                    <v-avatar
                      class="rounded-lg"
                      tile
                      size="55px"
                      color="primary"
                    >
                      <v-icon icon="mdi-account" color="white" />
                    </v-avatar>
                    <div class="ml-2 mr-2">
                      <div style="font-size: 14px" class="font-weight-bold">
                        {{ $t('You have request add friend from') }}
                      </div>
                      <div style="font-size: 12px" class="">
                        {{ item.sender.fullName }}
                      </div>
                    </div>
                    <div class="ml-auto my-auto">
                      <v-btn
                        variant="flat"
                        rounded="xl"
                        color="primary"
                        class="mr-2"
                        icon="mdi-account-plus-outline"
                        @click="acceptFriendRequest(item)"
                      />

                      <v-btn
                        rounded="xl"
                        variant="flat"
                        color="grey"
                        icon="mdi-close"
                        @click="rejectFriendRequest(item)"
                      />
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-divider class="mr-4 ml-4" />
            </v-col>
          </v-row>
        </v-responsive>
      </v-card>
    </v-dialog>

    <show-detail-answer
      v-model="dialogShowDetails"
      :req="dataRequest"
      @confirm="deleteReq"
    />

    <dialog-confirm
      v-model="dialogConfirms"
      :req="dataRequest"
      @cancel="deleteReq"
    />
  </div>
</template>
