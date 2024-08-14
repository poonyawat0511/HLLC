interface Assessment {
  id: string
  question: {
    th: string
    en: string
  }
  status: string
  type: string
  required: boolean
  section: string | null
  activity: string | null
}

interface Section {
  id: string
  title: {
    th: string
    en: string
  }
  subtitle: {
    th: string
    en: string
  }
  order: number
}

interface IAssessment extends Assessment {
  section: Section
}