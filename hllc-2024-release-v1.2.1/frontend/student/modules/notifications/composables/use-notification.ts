import { toLocaleTimeStamp } from '../utils/timestamp'

export function useNotification() {
  const items = useState<NotificationEntity[]>('notifications', () => [])
  /** State for checking that favorite is fetched */
  const isFetch = useState<boolean>('notification:isFetch', () => false)

  const { data: user } = useAuth()
  const { $api } = useApi()
  const adapter = useDate()

  const unreads = computed(() => {
    return items.value
      .filter((notification) => !notification.read)
      .sort((a, b) => b.value - a.value)
  })

  const reads = computed(() => {
    return items.value
      .filter((notification) => notification.read)
      .sort((a, b) => b.value - a.value)
  })

  /**
   * A function to get all fresher contents
   * @param deep - reload wheter the contest is loaded
   */
  const fetch = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const response = await $api.get<{ data: NotificationResponse[] }>(
        `users/${user.value.id}/notifications`
      )
      items.value = response.data.map<NotificationEntity>((item) => ({
        ...item,
        timestamp: {
          th: toLocaleTimeStamp('th', item.timestamp, adapter),
          en: toLocaleTimeStamp('en', item.timestamp, adapter),
        },
        value: new Date(item.timestamp).getTime(),
      }))
      isFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }

  /**
   * A function to read existing notification
   * @param notification - notification to read
   */
  const read = async (notification: NotificationEntity) => {
    const noti = items.value.find((item) => item.id === notification.id)
    if (!noti || noti.read) return
    try {
      await $api.post('notifications/read', {
        body: { user: user.value.id, notification: noti.id },
      })
      noti.read = true
    } catch (error) {
      console.error('Error reading notification', error)
    }
  }

  /**
   * Push new notification to the list
   * @param notification - Noti fication to add
   */
  const push = (notification: NotificationEntity) => {
    const noti = items.value.find((item) => item.id === notification.id)
    if (noti) return
    items.value.push({
      ...notification,
      timestamp: {
        th: toLocaleTimeStamp('th', notification.timestamp, adapter),
        en: toLocaleTimeStamp('en', notification.timestamp, adapter),
      },
      value: new Date(notification.timestamp as Date).getTime(),
    })
  }

  return { reads, unreads, fetch, read, push }
}
