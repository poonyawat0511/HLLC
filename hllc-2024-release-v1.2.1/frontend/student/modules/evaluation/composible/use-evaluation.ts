export function useEvaluation() {
  const { $api } = useNuxtApp()
  const { data: user } = useAuth()
  const evaluationData = ref<EvaluationModel[]>([])
  const evaluations = ref<
    Array<{ id: string; name: { th: string; en: string }; value: number }>
  >([])
  const actData = ref<ActivitiesModel[]>([])

  const getEvaluation = async () => {
    try {
      if (!user.value || !user.value.id) {
        console.error('User ID is not available')
        return
      }
      const evaluation = await $api.get<EvaluationModel[]>(
        `/evaluations/search/${user.value.id}`
      )
      evaluationData.value = evaluation.data
      mapData()
    } catch (error) {
      console.error(error)
    }
  }

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

  const mapData = () => {
    if (!evaluationData.value.length) {
      evaluations.value = actData.value.map((activity) => ({
        id: activity.id,
        name: activity.name,
        value: 0,
      }))
      return
    }

    const userEvaluation = evaluationData.value
    evaluations.value = actData.value.map((activity) => {
      const evaluationMatch = userEvaluation.find(
        (evaluation) => evaluation.activity.id === activity.id
      )      
      return {
        id: activity.id,
        name: activity.name,
        value: evaluationMatch ? 1 : 0,
      }
    })
  }

  onMounted(async () => {
    await getActivities()
    await getEvaluation()
  })

  return {
    evaluations,
    actData,
  }
}
