<script setup lang="ts">
const { $api } = useNuxtApp()
definePageMeta({
    breadcrumbs: [
        { to: '/', title: 'Home' },
        { to: '/notifications', title: 'Notifications' },
        { to: '/notifications/management', title: 'Notification Management' },
    ],
})

const headers = reactive([
    { title: 'Notification',align: 'start' ,value: 'notification' },
    { title: 'Type', value: 'type' },
    { title: 'Recipients', value: 'recipients' },
    { title: 'Actions', value: 'actions' },
])

enum RecipientType {
  Major = 'MAJOR',
  School = 'SCHOOL',
  Individual = 'INDIVIDUAL',
}

interface Recipient {
  type: RecipientType
  id: string
}

interface INotification {
    id: string
    title: { th: string, en: string }
    subtitle: { th: string, en: string }
    detail: { th: string, en: string }
    icon: string
    image: string
    redirect: {
        url: string
        btnMessage: {
            th: string
            en: string
        }
    } | null
    recipients: 'everyone' | Recipient[]
    timestamp: Date
    formattedTimeStamp?: string
}

const notifications = reactive<INotification[]>([])
const fetchNotifications = async () => {
    const response = await $api.get<{ data: INotification[]}>('/notifications?includes=recipients')
    notifications.push(
        ...response.data.map(notification => ({
            ...notification,
            formattedTimeStamp: formatDate(new Date(notification.timestamp)),
        }))
    )
}

const latestNotification = computed(() => {
    return notifications
        .map(notification => ({
          ...notification,
          timestamp: new Date(notification.timestamp), 
        }))
        .sort((a, b) => {
          const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return dateB.getTime() - dateA.getTime();
        });
})

const formatDate = (date: Date) => {
  return `${date.toLocaleDateString('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} | ${date.toLocaleTimeString('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })}`
}

const notiDialog = reactive<{ value: boolean }>({ value: false })
const selectedNotification = ref<INotification | null>(null)

const openDialog = async (notification: INotification) => {
  selectedNotification.value = notification
  notiDialog.value = true
}

const dialogConfirm = ref(false)

const confirmDelete = async (notification: INotification) => {
    selectedNotification.value = notification
    dialogConfirm.value = true
}

const onDelete = async () => {
    try {
        const response = await $api.delete<ApiResponse<INotification>>(`/notifications/${selectedNotification.value?.id}`)
        
        if (response.statusCode === 200) {
            const index = notifications.findIndex(notification => notification.id === selectedNotification.value?.id)
            if (index !== -1) notifications.splice(index, 1)
            onSnackbar('Delete notification successfully', 'success')
        } else {
            onSnackbar(response.message, 'warning')
        }
    } catch (error) {
        onSnackbar('Something went wrong', 'error')
    }
}

const snackbar = ref(false)

const snackbarNotify = reactive({
  title: '',
  type: '',
})

const onSnackbar = (title: string, type: string) => {
  snackbarNotify.title = title
  snackbarNotify.type = type
  snackbar.value = true
}

onMounted(() => {
    fetchNotifications()
})
</script>

<template>
    <v-container fluid>
        <v-row class="d-flex align-center justify-center">
            <v-col cols="12" md="6" class="d-flex">
                <h2>Notification Management</h2>
            </v-col>
        </v-row>
        <v-card class="rounded-lg pa-2" elevation="0" border>

            <!-- Table -->
            <v-data-table 
                :headers="headers" 
                :items="latestNotification"
            >
                <template #[`item.notification`]="{ item: notification }">
                    <notifications-card
                        class="ma-2"
                        :item="notification"
                        @click:first="openDialog(notification)"
                        border
                    />
                </template>

                <template #[`item.type`]="{ item }">
                    <v-chip-group column>
                        <v-chip v-if="item.recipients === 'everyone'">
                            EVERYONE
                        </v-chip>
                        <v-chip v-else v-for="recipient in item.recipients">
                            {{ recipient.type }}
                        </v-chip>
                      </v-chip-group>
                </template>

                <template #[`item.recipients`]="{ item }">
                    <v-chip-group column>
                        <v-chip v-if="item.recipients === 'everyone'">
                            EVERYONE
                        </v-chip>
                        
                        <div v-else>
                            <v-chip  v-for="recipient in item.recipients">
                                <template v-if="recipient.type === 'INDIVIDUAL'">
                                  {{ `${recipient.id?.name?.first} ${recipient.id?.name?.last}` }}
                                </template>
                                <template v-else>
                                  {{ recipient.id.acronym }}
                                </template>
                              </v-chip>
                        </div>
                      </v-chip-group>
                </template>

                <template #[`item.actions`]="{ item }">
                    <v-btn 
                        variant="text"
                        color="error"
                        icon
                        @click="confirmDelete(item)"
                    > 
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>

                <template #no-data>
                    <v-chip variant="outlined" rounded="lg" color="error">
                        No notification
                    </v-chip>
                </template>
            </v-data-table>
        </v-card>

        <!-- Notification Dialog -->
        <notifications-dialog
            v-model="notiDialog.value"
            :dialog="notiDialog.value"
            :item="selectedNotification"
        />

        <SnackbarNotify 
            v-model="snackbar" 
            :title="snackbarNotify.title" 
            :type="snackbarNotify.type" 
        />

        <DialogConfirm
            v-model="dialogConfirm"
            image="../../icons/delete.png"
            title="Delete this notification?"
            colorConfirm="error"
            @submit="onDelete"
        />
    </v-container>
</template>