<script setup lang="ts">
const { data: user } = useAuth()
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})
const router = useRouter()
const { friendRequest, deleteReq, fetchFriendRequest } = useFetchFriendRequest()
const { colors } = useSchool()

const onClose = () => {
  router.push('/communities')
}

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
onMounted(async () => {
  await fetchFriendRequest()
})

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
</script>

<template>
  <v-container fluid>
    <NavigationBar />
    <v-col>
      <v-card
        v-if="user.type == 'TESTER'"
        rounded="xl"
        :color="colors['card-surface']"
        elevation="0"
        class="responsive-card-height mt-n3"
        :transition="
          $vuetify.display.mobile ? 'dialog-bottom-transition' : null
        "
        fullscreen
      >
        <v-card-title class="d-flex align-center">
          <v-icon size="25" class="mr-2" @click="onClose">mdi-close</v-icon>
          <div class="flex-grow-1 text-center">{{ $t('Friend Requests') }}</div>
        </v-card-title>
        <v-card
          v-for="(req, index) in friendRequest"
          :key="index"
          class="mb-2"
          variant="flat"
        >
          <v-divider />
          <v-card-action>
            <v-col>
              <div class="d-flex justify-between">
                <v-col>
                  <p>
                    <strong>
                      {{ $t('You have request add friend from') }} :
                      {{ req.sender.fullName }}</strong
                    >
                  </p>
                </v-col>

                <v-col cols="3">
                  <v-btn
                    variant="flat"
                    rounded="xl"
                    @click="acceptFriendRequest(req)"
                  >
                    <v-icon class="text-primary" size="25">
                      mdi-account-plus-outline
                    </v-icon>
                  </v-btn>
                  <v-btn
                    rounded="xl"
                    variant="flat"
                    @click="rejectFriendRequest(req)"
                  >
                    <v-icon size="25" class="text-error"> mdi-close </v-icon>
                  </v-btn>
                </v-col>
              </div>
            </v-col>
          </v-card-action>
        </v-card>
      </v-card>
      <v-card v-else :color="colors['card-surface']" rounded="xl" elevation="0">
        <v-card-text>
          <p class="text-center">{{ $t('communityComing') }}</p>
        </v-card-text>
      </v-card>
    </v-col>

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
  </v-container>
</template>
