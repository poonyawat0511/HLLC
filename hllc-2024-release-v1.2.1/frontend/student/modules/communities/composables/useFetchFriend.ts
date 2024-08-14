export const useFetchFriend = () => {
  const { $api } = useApi()
  const { data: user } = useAuth()

  // Refs for data
  const dataFriendLists = useState<Relationship[]>('friendLists', () => [])
  const switchedMajors = ref<Major[]>([])
  const allFriendLists = ref<FriendsList[]>([])
  const getMajorFriendList = useState<Major | null>(
    'majorFriendList',
    () => null
  )
  // Fetch relationships and categorize majors
  const fetchRelationShipWithUser = async () => {
    try {
      const response = await $api.get<Relationship[]>(
        `relationship/search/${user.value.id}`
      )
      dataFriendLists.value = response.data

      // Extract unique major IDs
      const majorIds = new Set<string>()
      dataFriendLists.value.forEach((relationship) => {
        const majorId =
          relationship.sender.id === user.value.id
            ? relationship.receiver.major
            : relationship.sender.major

        if (majorId) {
          majorIds.add(majorId)
        }
      })

      // Fetch all majors and categorize them
      await Promise.all(
        Array.from(majorIds).map(async (majorId) => {
          const response = await fetchByMajorId(majorId)
          if (response) {
            switchedMajors.value.push(response)
          }
        })
      )
    } catch (error) {
      console.error('Error fetching friendships:', error)
    }
  }

  // Fetch major by ID
  const fetchByMajorId = async (majorId: string): Promise<Major | null> => {
    try {
      const response = await $api.get<Major>(`majors/${majorId}`)
      getMajorFriendList.value = response.data || null
      return response.data || null
    } catch (error) {
      console.error('Error fetching major:', error)
      return null
    }
  }

  const fetchRelationShip = async () => {
    try {
      const response = await $api.get<FriendsList[]>(`relationship`)

      // Sort the data by friend count in descending order
      const sortedList = response.sort((a, b) => {
        if (a.friendCount && b.friendCount) {
          return b.friendCount - a.friendCount
        }
        return 0
      })

      // Get the top 10 entries and add the rank property
      const top10List = sortedList.slice(0, 10).map((friend, index) => ({
        ...friend,
        rank: index + 1,
      }))

      allFriendLists.value = top10List
    } catch (error) {
      console.error('Error fetching friendships:', error)
    }
  }

  return {
    fetchRelationShipWithUser,
    fetchByMajorId,
    fetchRelationShip,
    dataFriendLists,
    switchedMajors,
    allFriendLists,
    getMajorFriendList,
  }
}
