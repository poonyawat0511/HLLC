
export const useFetchFriendRequest = () => {
  const { $api } = useApi()
  const countFriendRequest = useState<number>(
    'friendRequest:countFriendRequest',
    () => 0
  )
  const { data: user, token } = useAuth()
  const friendRequest = useState<FriendRequest[]>(
    'friendRequest:isFetch',
    () => []
  )
  const decodeFromBase64 = (data: string): string => {
    try {
      const decodedData = atob(data)
      return decodeURIComponent(escape(decodedData))
    } catch (error) {
      console.error('Error decoding from Base64:', error)
      return 'Decryption failed'
    }
  }

  const fetchFriendRequest = async () => {
    if (!user.value || !user.value.id) return
    
    try {
      const res = await $api.get<{ data: FriendRequest[] }>(
        `answer-friends/receiver/${user.value.id}`
      )

      friendRequest.value = res.data.map((request) => {
        return {
          ...request,
          questions: request.questions.map((question) => {
            if (question.answer) {
              const decodedAnswer = decodeFromBase64(question.answer)
              return {
                ...question,
                messages: decodedAnswer,
              }
            }
            return {
              ...question,
              messages: '',
            }
          }),
        }
      })
      countFriendRequest.value = friendRequest.value.length
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    }
  }

  const sendNotification = async (
    action: 'accept' | 'reject',
    friend: FriendRequest
  ) => {
    const isAccepted = action === 'accept'
    const notiData = {
      title: {
        th: isAccepted ? 'คำขอของคุณได้รับการตอบรับ' : 'คำขอของคุณถูกปฏิเสธ',
        en: isAccepted
          ? 'Your request has been accepted'
          : 'Your request has been rejected',
      },
      subtitle: {
        th: `จาก ${friend.receiver.fullName}`,
        en: `From ${friend.receiver.fullName}`,
      },
      detail: {
        th: isAccepted ? 'คุณมีเพื่อนใหม่' : 'คำขอเพื่อนของคุณถูกปฏิเสธ',
        en: isAccepted
          ? 'You have a new friend'
          : 'Your friend request has been rejected',
      },
      icon: isAccepted ? 'mdi-account-check' : 'mdi-account-cancel',
      image: new Blob([], { type: 'image/png' }), // Sending an empty blob

      recipients: [
        {
          type: 'INDIVIDUAL',
          id: friend.sender.id,
        },
      ],
    }

    // Convert the data object to FormData
    const { ...data } = notiData
    const item = Object.assign({}, data)
    Object.assign(item)
    const formData = objectToFormData(item)

    try {
      await $api.post<INotification>('notifications', { body: formData })
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const postRelationShip = async (req: FriendRequest) => {
    try {
      await $api.post<{ data: Relationship }>('relationship', {
        body: {
          sender: req.sender.id,
          receiver: req.receiver.id,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteReq = async (req: FriendRequest, action: 'accept' | 'reject') => {
    try {
      await $api.delete(`/answer-friends/${req.id}`)
      await sendNotification(action, req)
      await fetchFriendRequest()
      if (action === 'accept') {
        await postRelationShip(req)
      }
    } catch (error) {
      console.error('Error handling friend request:', error)
    }
  }

  return {
    friendRequest,
    token,
    countFriendRequest,
    fetchFriendRequest,
    deleteReq,
  }
}
