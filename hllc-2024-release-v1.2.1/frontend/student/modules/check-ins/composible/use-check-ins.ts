export function useCheckIns() {
  const { data: user } = useAuth()
  const { $api } = useNuxtApp()
  const progressData = ref<CheckInsModel[]>([])
  const processUser = ref<
    Array<{ id: string; name: { th: string; en: string }; value: number }>
  >([])

  const actData = ref<ActivitiesModel[]>([])

  const getActivities = async () => {
    try {
      const activities = await $api.get<{ data: ActivitiesModel[] }>(
        '/activities'
      )
      actData.value = activities.data
    } catch (error) {
      console.error(error)
    }
  }

  const getProgress = async () => {
    try {
      const progress = await $api.get<{ data: CheckInsModel[] }>(
        `/check-ins/search/${user.value.id}`
      )
      progressData.value = progress.data
      mapData()
    } catch (error) {
      console.error(error)
    }
  }

  const mapData = () => {
    if (!progressData.value.length) {
      processUser.value = actData.value.map((activity) => ({
        id: activity.id,
        name: activity.name,
        value: 0,
      }))
      return
    }

    const userProgress = progressData.value
    processUser.value = actData.value.map((activity) => {
      const progressMatch = userProgress.find(
        (progress) => progress.activity === activity.id
      )
      return {
        id: activity.id,
        name: activity.name,
        value: progressMatch ? 1 : 0,
      }
    })
  }

  onMounted(async () => {
    await getActivities()
    await getProgress()
  })

  return {
    progressData,
    processUser,
    actData,
  }
}
