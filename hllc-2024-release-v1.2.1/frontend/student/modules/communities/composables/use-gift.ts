export const useGift = () => {
  const { $api } = useApi()
  const { data: user } = useAuth()
  const giftByUser = useState<Gift[]>('gift:giftByUser', () => [])

  const fetchGift = async () => {
    if (!user.value || !user.value.id) return
    try {
      const res = await $api.get<{ data: Gift[] }>(
        `gifts/sender/${user.value.id}`
      )
      giftByUser.value = res.data
    } catch (error) {
      console.error('Error fetching gifts:', error)
    }
  }

  const postGift = async (receiverId: string) => {
    try {
      await $api.post('gifts', {
        body: {
          sendergift: user.value.id,
          receivergift: receiverId,
        },
      })
      sentNoti(receiverId)
      fetchGift()
    } catch (error) {
      console.error('Error posting gift:', error)
    }
  }

  const sentNoti = async (receiverId: string) => {
    const notiData = {
      title: {
        th: 'มีเพื่อนของคุณส่งของขวัญให้คุณ',
        en: 'Your friend sent you a gift',
      },
      subtitle: {
        th: `จาก ${user.value.fullName}`,
        en: `From ${user.value.fullName}`,
      },
      detail: {
        th: 'คุณต้องการส่งของขวัญให้เพื่อนของคุณกลับไหม?',
        en: 'Do you want to send a gift back to your friend?',
      },
      icon: 'mdi-star',
      image: new Blob([], { type: 'image/png' }), // Sending an empty blob
      redirect: {
        url: 'communities?view=friends',
        btnMessage: {
          th: 'ไปดู',
          en: 'See',
        },
      },
      recipients: [
        {
          type: 'INDIVIDUAL',
          id: receiverId,
        },
      ],
    }

    const { redirect, ...data } = notiData
    const item = Object.assign({}, data)
    Object.assign(item, { redirect })
    const formData = objectToFormData(item)

    try {
      await $api.post<INotification>('notifications', { body: formData })
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  return {
    giftByUser,
    fetchGift,
    postGift,
  }
}
