export function useAnswerQuestion() {
  const isFetch = useState<boolean>('answer:isFetch', () => false)
  const AnswerQuestion = useState<IAnswerQuestion[]>(
    'answer:AnswerQuestion',
    () => []
  )
  // API plugin
  const { $api } = useApi()

  /**
   * A function to get all voucher code
   * @param deep - reload wheter the contest is loaded
   */
  const fetchAnswer = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const reponse = await $api.get<{ data: IAnswerQuestion[] }>(
        '/answer-questions'
      )
      
      AnswerQuestion.value = reponse.data
      isFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }
  return {
    fetchAnswer,
    AnswerQuestion
  }
}
