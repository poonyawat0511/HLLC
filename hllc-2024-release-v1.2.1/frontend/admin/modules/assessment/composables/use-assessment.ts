export function useAssessment() {
  const isFetch = useState<boolean>('assessment:isFetch', () => false)
  const assessments = useState<IAssessment[]>('assessment:assessment', () => [])
  const isFetchActivity = useState<boolean>('assessment:activity', () => false)
  const activity = useState<Activity[]>('assessment:activity', () => [])
  const sections = useState<string[]>('assessment:sections', () => [])

  // API plugin
  const { $api } = useApi()
  /**
   * A function to get all assessment
   * @param deep - reload wheter the contest is loaded
   */
  const fetchAssessment = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      
      const response = await $api.get<{ data: IAssessment[] }>('/assessments')
      assessments.value = response.data
      sections.value = response.data
        .map((a) => a.section)
        .filter((section) => section !== null) as unknown as string[]
    } catch (error) {
      console.error('Error fetching assessments', error)
      throw error
    }
  }

  /**
   * A function to get all activity
   * @param deep - reload wheter the contest is loaded
   */
  const fetchActivity = async (deep?: boolean) => {
    if (!deep && isFetchActivity.value) return
    try {
      const reponse = await $api.get<{ data: Activity[] }>('/activities')
      activity.value = reponse.data
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }

  const create = async (item: Assessment) => {
    try {
      if (!item) {
        throw new Error('No assessment data')
      }
      const data = {
        question: {
          th: item.question.th,
          en: item.question.en,
        },
        status: item.status,
        type: item.type,
        required: item.required,
        section: item.section,
        activity: item.activity,
      }
      await $api.post<Assessment>('/assessments', { body: data })
      console.log('post success')
      await fetchAssessment(true)
    } catch (error) {
      console.error('Error crete assessment:', error)
      throw error
    }
  }

  const edit = async (item: Assessment) => {
    try {
      if (!item) {
        throw new Error('No assessment data')
      }
      const data = {
        question: {
          th: item.question.th,
          en: item.question.en,
        },
        status: item.status,
        type: item.type,
        required: item.required,
        section: item.section,
        activity: item.activity,
      }
      console.log(item)
      await $api.put<Assessment>(`/assessments/${item.id}`, {
        body: data,
      })
      await fetchAssessment(true)
    } catch (error) {
      console.error('Error edit assessment', error)
      throw error
    }
  }

  const deleteAssessment = async (item: Assessment) => {
    try {
      await $api.delete<Assessment>(`/assessments/${item.id}`)
      await fetchAssessment(true) 
    } catch (error) {
      console.error('Error delete assessment', error)
      throw error
    }
  }

  return {
    assessments,
    fetchAssessment,
    activity,
    fetchActivity,
    create,
    sections,
    edit,
    deleteAssessment,
  }
}
