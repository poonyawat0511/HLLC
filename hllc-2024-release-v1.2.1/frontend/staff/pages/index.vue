<script setup lang="ts">
import { FetchError } from 'ofetch'

// Injections
const { $api } = useNuxtApp()
const { data: user } = useAuth()
const snackbar = inject<Snackbar>('snackbar')

// Tab
const route = useRoute()
const router = useRouter()
const tab = computed({
  get() {
    return route.query.tab === 'typing' ? 'typing' : 'camera'
  },
  set(value: string) {
    router.push({ query: { tab: value } })
  },
})

// Refs
const selectedActivities = ref<Activity[]>([])
const activities = ref<Activity[]>()

const form = reactive({
  user: null as User | null,

  async findUser(data: string) {
    const response = await $api.get<ApiResponse<User>>(`/users/search/${data}`)
    return response.data
  },

  async confirm(data: string) {
    try {
      const user = await this.findUser(data)
      this.user = user
      confirm.open()
    } catch (error) {
      const message = getErrorMessage(error)
      snackbar?.open([{ message, color: 'error', open: true }])
      this.preventNext()
    }
  },

  async checkIn(activity: Activity): Promise<Partial<SnackbarItem>> {
    try {
      confirm.loading = true
      await $api.post('/check-ins', {
        body: {
          user: this.user!.id,
          activity: activity.id,
          staff: user.value?.id,
        },
      })
      return {
        message: `Check in activity "${activity.name?.en}" successfully`,
        color: 'green darken-2',
        icon: 'mdi-checkbox-marked-circle-outline',
      }
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.data.message === 'Avtivity is closed') {
          return {
            message: `Activity "${activity.name?.en}" is closed for check-in`,
            color: 'red darken-1',
            icon: 'mdi-alert-circle-outline',
            open: true,
          }
        }
        if (error.statusCode === 409) {
          return {
            message: `Activty "${activity.name?.en}" has alredy check-in`,
            color: 'blue darken-1',
            icon: 'mdi-alert-circle-outline',
          }
        }

        return {
          message: error.data.message,
          color: 'red darken-1',
          icon: 'mdi-alert-circle-outline',
        }
        
      }
      const message = getErrorMessage(error)
      return {
        message,
        color: 'red darken-1',
        icon: 'mdi-alert-circle-outline',
      }
    }
  },

  preventNext() {},

  async save() {
    confirm.loading = true
    const responses = await Promise.all(
      selectedActivities.value.map((activity) => this.checkIn(activity))
    )
    snackbar?.open(
      responses.map((response) => ({ ...response, open: true } as SnackbarItem))
    )
    confirm.loading = false
    confirm.close()
    this.preventNext()
  },
})

const confirm = reactive({
  dialog: false,
  loading: false,

  open() {
    this.dialog = true
  },

  close() {
    this.dialog = false
    form.preventNext()
  },
})

/**
 * A function to handle the decoded data
 * @param data decoded data
 * @param next a function to call for next reader
 */
async function onDecode(data?: string, next?: () => void) {
  if (!data) return
  form.preventNext = async function () {
    await new Promise((resolve) => setTimeout(resolve, 500))
    next?.()
  }
  await form.confirm(data)
}

/**
 * A function to fetch Activity
 */
const fetchActivities = async () => {
  try {
    const response = await $api.get<{ data: Activity[] }>(
      `/admins/${user.value.id}/activities`
    )
    activities.value = response.data
  } catch (error) {
    console.error('Error fetching activities:', error)
    activities.value = []
  }
}

const checkRole = (userType: string) => {
  if (['AE'].includes(userType)) {
    router.push('/voucher')
  }
}

onMounted(() => {
  // Fetch item when page is ready
  checkRole(user.value.role)
  fetchActivities()
})
</script>

<template>
  <client-only>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card
            class="mx-auto"
            max-width="45rem"
            rounded="xl"
            variant="outlined"
          >
            <v-card-title class="text-center pt-5">
              Activity Check-In
            </v-card-title>
            <v-divider class="my-3" />
            <v-card-text>
              <v-select
                v-model="selectedActivities"
                :items="activities"
                rounded="pill"
                item-value="id"
                item-title="name.en"
                return-object
                label="Select activities"
                variant="outlined"
                chips
                hide-details
                clearable
                multiple
                density="comfortable"
                no-data-text="No activities open for check-in."
              >
                <template #selection="{ item: activity }">
                  <v-chip color="primary">{{ activity.name.en }}</v-chip>
                </template>
              </v-select>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <scanner-tabs
            v-model="tab"
            rounded="xl"
            :force="!selectedActivities?.length"
            :input-props="{
              density: 'comfortable',
              rounded: 'pill',
            }"
            force-message="Please select an activity"
            @decode="onDecode"
          />
        </v-col>
      </v-row>

      <confirm-check-in
        v-if="form.user"
        v-model="confirm.dialog"
        :loading="confirm.loading"
        :user="form.user"
        @cancel="confirm.close()"
        @confirm="form.save()"
      />
    </v-container>
  </client-only>
</template>
