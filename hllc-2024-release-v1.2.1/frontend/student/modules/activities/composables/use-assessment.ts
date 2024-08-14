export function useAsssessment(activity: IActivity) {
  const { $api } = useApi()
  const questions = ref<ActivityQuestion[]>([])
  const { data: user } = useAuth()
  const { items, init: initItems } = useEvolution()

  /**
   * A function to fetch the activity's questions
   */
  async function init() {
    try {
      const response = await $api.get<{ data: ActivityQuestion[] }>(
        `/activities/${activity.id}/assessments`
      )
      questions.value = response.data
    } catch (error) {
      questions.value = []
      console.error('Error fetching question', error)
    }
  }

  async function save(items: ActivityQuestion[]) {
    try {
      const answers = items.map(({ id, value }) => ({
        question: id,
        value: value?.toString(),
      }))
      const body = {
        author: user.value.id,
        values: answers,
        activity: activity.id,
      }
      const response = await $api.post<ApiResponse<Evaluation>>(
        '/evaluations',
        { body }
      )
      return response.data
    } catch (error) {
      console.error('Error submit answers:', error)
    }
  }

  async function createItem() {
    try {
      await initItems()
      const item = items.value.find((item) => item.activity === activity.id)
      if (!item) return
      const body = { user: user.value.id, item: item.id }
      const response = await $api.post<ApiResponse<Evolution>>(`/evolutions`, {
        body,
      })
      item.evolution = response.data
      return item
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  return {
    questions,
    init,
    save,
    createItem,
  }
}
