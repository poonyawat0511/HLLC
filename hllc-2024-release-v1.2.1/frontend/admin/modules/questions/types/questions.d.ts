interface IQuestions {
  id: string
  title: {
    th: string
    en: string
  }
  text: {
    th: string
    en: string
  }
  image: string | File
}