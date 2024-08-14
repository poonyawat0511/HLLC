export const useFetchQuestions = () => {
  const { $api } = useApi()
  const question = useState('question', () => ({} as Questionnaire))
  const { data: user } = useAuth()

  const fetchQuestions = async () => {
    try {
      const res = await $api.get<{ data: Questionnaire }>('questionnaire')
      question.value = res.data
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }
  return {
    fetchQuestions,
    question,
    user,
  }
}
