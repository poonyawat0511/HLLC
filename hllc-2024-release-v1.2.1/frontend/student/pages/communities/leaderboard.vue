<script setup lang="ts">
const { data: user } = useAuth()
definePageMeta({
  menu: {
    display: true,
  },
  background: true,
})
const { allFriendLists } = useFetchFriend()
const { colors } = useSchool()
</script>

<template>
  <v-container fluid>
    <NavigationBar />
    <v-card
      v-if="user.type == 'TESTER'"
      :color="colors['card-surface']"
      rounded="xl"
      elevation="0"
      class="responsive-card-height mt-n3"
    >
      <v-card-title class="d-flex align-center">
        <div class="flex-grow-1 text-center">Leader Board</div>
      </v-card-title>
      <v-col>
        <v-card
          class="border border-grey rounded-xl bg-white fill-height mt-2"
          variant="flat"
        >
          <v-list>
            <FriendItem
              v-for="friend in allFriendLists"
              :key="friend.userId"
              :full-name="friend.fullName"
              :major="friend.major"
              :friend-count="friend.friendCount"
              :rank="friend.rank"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-card>
    <v-card v-else :color="colors['card-surface']" rounded="xl" elevation="0">
      <v-card-text>
        <p class="text-center">{{ $t('communityComing') }}</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
