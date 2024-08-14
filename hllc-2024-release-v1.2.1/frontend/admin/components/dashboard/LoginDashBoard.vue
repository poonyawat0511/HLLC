<script setup lang="ts">

const props = defineProps({
  loginData: {
    type: Array as PropType<UserLogin[]>,
    required: true,
  },
})


const allUsersCount = computed(() => {
  return props.loginData.totalUsers
})


const loggedInUsersCount = computed(() => {
  return props.loginData.registeredUsers
})

const unloggedInUsersCount = computed(() => {
  return props.loginData.notRegisteredUsers
})

</script>
<template>
  <v-container>
    <v-card class="rounded-xl" elevation="4">
      <v-card-text class="d-flex flex-column align-center">
        <v-progress-circular
          :size="180"
          :width="20"
          :model-value="(loggedInUsersCount / allUsersCount) * 100"
          color="teal"
          class="d-flex justify-center mb-1"
        >
          <div class="d-flex flex-column align-center">
            <h3>{{ loggedInUsersCount }}</h3>
            <span class="text-caption">Logged in students</span>
          </div>
        </v-progress-circular>
      </v-card-text>
      <v-card-text class="mb-2">
        <v-ul>
          <li>
            All users : <b>{{ allUsersCount }}</b>
          </li>
          <li>
            Unlogged in users : <b>{{ unloggedInUsersCount }}</b>
          </li>
        </v-ul>
      </v-card-text>
    </v-card>
  </v-container>
</template>
