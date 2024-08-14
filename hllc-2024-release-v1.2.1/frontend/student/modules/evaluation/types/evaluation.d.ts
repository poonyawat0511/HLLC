interface EvaluationModel {
  value?: number
  activity: {
    id: string
    name: {
      th: string
      en: string
    }
  }
}
interface Evaluation {
  activities: { id: string }
  value: number
}

interface ActivitiesModel {
  id: string
  name: {
    th: string
    en: string
  }
}

interface UserModel {
  id: string
  fullName: string
  username: string
}