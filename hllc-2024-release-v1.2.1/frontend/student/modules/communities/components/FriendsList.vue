<script setup lang="ts">
const { colors } = useSchool()
const { getMajorFriendList } = useFetchFriend()
const { data: user } = useAuth()
const { giftByUser, postGift } = useGift()
interface Props {
  item: Relationship
}
defineProps<Props>()
// const searchQuery = ref('')
const dialogConfirm = ref(false)
const selectedFriend = ref<Relationship | null>(null)

// Helper function to get the friend's name based on user ID
const getFriendName = (friend: Relationship) => {
  return user.value.id === friend.sender.id
    ? friend.receiver.fullName
    : friend.sender.fullName
}

// Helper function to get the friend's major based on user ID
const getFriendMajor = (friend: Relationship) => {
  return user.value.id === friend.sender.id
    ? getMajorFriendList.value?.name.en
    : getMajorFriendList.value?.name.en
}

const isGiftSentToReceiver = (friend: Relationship) => {
  const receiverId =
    user.value.id === friend.sender.id ? friend.receiver.id : friend.sender.id
  const giftFound = giftByUser.value.some((gift) => {
    return gift.receivergift.id === receiverId && gift.isSended
  })
  return giftFound
}

const getMajor = (friend: Relationship) => {
  const major = getFriendMajor(friend)
  return `${name} (${major})`
}

const onConfirm = () => {
  if (selectedFriend.value) {
    const receiverId =
      user.value.id === selectedFriend.value.sender.id
        ? selectedFriend.value.receiver.id
        : selectedFriend.value.sender.id

    postGift(receiverId)
      .then(() => {
        dialogConfirm.value = false
      })
      .catch((error: string) => {
        console.error('Failed to send gift:', error)
      })
  }
}

// Function to set the selected friend and show the dialog
const selectFriend = (friend: Relationship) => {
  selectedFriend.value = friend
  dialogConfirm.value = true
}
</script>

<template>
  <div>
    <v-card variant="flat" :color="colors['card-surface']" rounded="xl">
      <v-card-text>
        <div class="d-flex">
          <v-avatar class="rounded-lg" tile size="55px" color="primary">
            <v-icon icon="mdi-account" color="white" />
          </v-avatar>
          <div class="ml-2 mr-2">
            <div style="font-size: 14px">
              {{ getFriendName(item) }}
            </div>
            <div style="font-size: 12px">
              {{ getMajor(item) }}
            </div>
          </div>
          <div class="ml-auto my-auto">
            <v-btn
              icon
              class="ml-auto"
              elevation="0"
              :color="colors['primary']"
              :disabled="isGiftSentToReceiver(item)"
              @click="selectFriend(item)"
            >
              <v-icon icon="mdi-gift-outline" />
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialogConfirm" max-width="30rem">
      <div style="position: relative">
        <div
          style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: end;
            z-index: 1;
          "
        >
          <v-img src="/icons/gift.png" style="width: 25rem" />
        </div>
        <v-card
          :style="{
            backgroundColor: colors['dialog-surface'],
            '-webkit-backdrop-filter': 'blur(15px)',
            'backdrop-filter': 'blur(15px)',
            position: 'relative',
            bottom: $vuetify.display.xs ? '8vh' : '6vh',
          }"
          class="pr-4 pl-4"
          rounded="xl"
          elevation="0"
        >
          <div style="height: 5rem" />
          <v-card-title class="text-center">
            {{ $t('Send gift') }} to
            <span class="text-primary">{{
              getFriendName(selectedFriend as Relationship)
            }}</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="dialogConfirm = false">
              {{ $t('Cancel') }}
            </v-btn>
            <v-btn
              variant="flat"
              class="px-5"
              rounded
              color="primary"
              @click="onConfirm"
            >
              {{ $t('Confirm') }}
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </div>
</template>
