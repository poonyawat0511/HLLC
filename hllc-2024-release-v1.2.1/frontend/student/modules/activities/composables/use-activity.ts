export function useActivity() {
  const { $api } = useApi()
  const isFetch = useState<boolean>('activity:isFetch', () => false)
  const activities = useState<IActivity[]>('activity:items', () => [])

  const { data: user } = useAuth()

  /**
   * A function to get all activity contents
   * @param deep - reload wheter the contest is loaded
   */
  const fetchActivities = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const response = await $api.get<{ data: IActivity[] }>(
        `/users/${user.value.id}/activities`
      )
      activities.value = response.data
    } catch (error) {
      console.error('Error fetching activities:', error)
      throw error
    }
  }

  /**
   * A function to get a activity by id
   * @param id - the id of the activity
   * @param deep - reload wheter the contest is loaded
   */
  const findOne = async (id: string, deep?: boolean) => {
    if (!deep) {
      const item = activities.value.find((item) => item.id === id)
      if (item) return Object.assign({}, item)
    }
    try {
      const response = await $api.get<{ data: IActivity }>(
        `/users/${user.value.id}/activities/${id}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching content id', id, error)
      throw error
    }
  }

  function updateCheckIn(checkIn: CheckIn) {
    const activity = activities.value.find(
      (item) => item.id === checkIn.activity
    )
    if (activity) {
      activity.checkInAt = checkIn.timestamp
      activity.status = { step: 2, message: 'waiting' }
    }
  }

  function updateAssessment(assessment: Assessment) {
    const activity = activities.value.find(
      (item) => item.id === assessment.activity
    )
    if (activity) {
      activity.takeAssessmentAt = assessment.timestamp
      activity.status = { step: 3, message: 'success' }
    }
  }

  return {
    fetchActivities,
    findOne,
    activities,
    updateCheckIn,
    updateAssessment,
  }
}
