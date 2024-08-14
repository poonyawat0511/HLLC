interface IQuestion {
  id: string
  title: { th: string; en: string }
  text: { th: string; en: string }
  image: string
}

interface IAnswer {
  id: string
  question: Question
  value: string
  user: string
}

