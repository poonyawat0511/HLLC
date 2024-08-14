interface NotificationResponse {
  id: string
  title: { th: string; en: string }
  subtitle: { th: string; en: string }
  detail: { th: string; en: string }
  icon: string
  image: string
  redirect: {
    url: string
    btnMessage: { th: string; en: string }
  }
  timestamp: Date
  read: boolean
  value: number
}

interface NotificationEntity extends NotificationResponse {
  timestamp: { th?: string; en?: string }
}
