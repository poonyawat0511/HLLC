export function useCommunity() {
  const rooms = useState<Room[]>('room:rooms', () => [])
  const isRoomsFetch = useState<boolean>('room:isRoomsFetch', () => false)
  const room = useState<Room | null>('room:room', () => null)

  const { $api } = useApi()

  /**
   * A function to get all rooms
   * @param deep - reload wheter the rooms is loaded
   */
  const fetchRooms = async (deep?: boolean) => {
    if (!deep && isRoomsFetch.value) return
    try {
      const response = await $api.get<{ data: Room[] }>('/rooms')
      rooms.value = response.data
      isRoomsFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }

  /**
   * A function to get room
   * @param id - the id of the room
   * @param deep - reload wheter the room is loaded
   */
  const fetchRoom = async (id: string | null) => {
    try {
      const response = await $api.get<{ data: Room | null }>(`/rooms/${id}`)
      room.value = response.data
    } catch (error) {
      console.error('Error fetching room', error)
      throw error
    }
  }

  return {
    rooms,
    fetchRooms,
    isRoomsFetch,
    fetchRoom,
    room
  }
}
