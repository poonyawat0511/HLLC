export function useQuestions() {
  const { $api } = useNuxtApp()
  const questionsData = useState<IQuestions[]>('voucher:voucherCode', () => [])
  const isFetch = useState<boolean>('questions:isFetch', () => false)

  /**
   * A function to get all voucher code
   * @param deep - reload wheter the contest is loaded
   */
  const fetchQuestions = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const reponse = await $api.get<{ data: IQuestions[] }>('/questions')
      questionsData.value = reponse.data
      isFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }

  /**
   * Function to create a new question code
   * @param questions - Data for the new question code
   */
  // Create a new question
  const createQuestion = async (
    questions: Partial<IQuestions>,
    id?: string
  ) => {
    try {
      let response
      if (id) {
        // If an ID is provided, perform an update (PUT)
        response = await $api.put<{ data: IQuestions }>(`/questions/${id}`, {
          body: questions,
        })
      } else {
        // If no ID is provided, perform a create (POST)
        response = await $api.post<{ data: IQuestions }>('/questions', {
          body: questions,
        })
      }
      const updatedQuestion = response.data
      await fetchQuestions(true)
      return updatedQuestion
    } catch (error) {
      console.error('Error saving question', error)
      throw error
    }
  }

  // Delete a question
  const deleteQuestion = async (id: string) => {
    try {
      await $api.delete(`/questions/${id}`)
      await fetchQuestions(true)
    } catch (error) {
      console.error(`Error deleting voucher ${id}:`, error)
      throw error
    }
  }

  return {
    questionsData,
    fetchQuestions,
    createQuestion,
    deleteQuestion,
  }
}
