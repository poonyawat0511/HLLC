export function useQuestion() {
  const questions = useState<IQuestion[]>('question:questions', () => [])
  const isQuestionsFetch = useState<boolean>(
    'question:isQuestionsFetch',
    () => false
  )
  const answers = useState<IAnswer[]>('answer:answers', () => [])
  const question = useState<IQuestion | null>('question:question', () => null)
  const isQuestionFetch = useState<boolean>(
    'question:isQuestionFetch',
    () => false
  )

  const { $api } = useApi()
  const { data: user } = useAuth()

  /**
   * A function to get all questions
   * @param deep - reload wheter the questions is loaded
   */
  const fetchQuestions = async (deep?: boolean) => {
    if (!deep && isQuestionsFetch.value) return
    try {
      const response = await $api.get<{ data: IQuestion[] }>('/questions/')
      questions.value = response.data
      isQuestionsFetch.value = true
    } catch (error) {
      console.error('Error fetching questions', error)
      throw error
    }
  }

  /**
   * A function to get all answers
   * @param id - the id of the answers
   */
  const fetchAnswers = async (id: string | null) => {
    try {
      const response = await $api.get<{ data: IAnswer[] }>(
        `/answer-questions/${id}/user`
      )
      answers.value = response.data
    } catch (error) {
      console.error('Error fetching answers', error)
      throw error
    }
  }

  /**
   * A function to get all question
   * @param id - the id of the contest
   * @param deep - reload wheter the question is loaded
   */
  const fetchQuestion = async (id: string | null, deep?: boolean) => {

    try {
      const response = await $api.get<{ data: IQuestion | null }>(
        `/questions/${id}`
      )
      question.value = response.data
      isQuestionFetch.value = true
    } catch (error) {
      console.error('Error fetching question', error)
      throw error
    }
  }

  const submit = async (item: IAnswer) => {
    try {
      if (!item) {
        throw new Error('No lamduan selected')
      }
      const body = {
        user: user.value.id,
        value: item.value,
        question: item.question,
      }
      await $api.post<IAnswer>('/answer-questions', { body })
      fetchAnswers(item.question)
    } catch (error) {
      console.error('Error submitting answer', error)
      throw error
    }
  }

  const edit = async (item: IAnswer) => {
    try {
      if (!item) {
        throw new Error('No lamduan selected')
      }
      const body = {
        user: user.value.id,
        value: item.value,
        question: item.question,
      }
      await $api.put<IAnswer>(`/answer-questions/${item.id}`, { body })
      fetchAnswers(item.question)
    } catch (error) {
      console.error('Error editing answer', error)
      throw error
    }
  }

  const deleteAnswer = async (item: IAnswer) => {
    try {
      if (!item) {
        throw new Error('No lamduan selected')
      }
      await $api.delete<IAnswer>(`/answer-questions/${item.id}`)
      fetchAnswers(item.question)
    } catch (error) {
      console.error('Error editing answer', error)
      throw error
    }
  }

  return {
    fetchQuestions,
    questions,
    fetchAnswers,
    answers,
    submit,
    edit,
    fetchQuestion,
    question,
    deleteAnswer,
  }
}
