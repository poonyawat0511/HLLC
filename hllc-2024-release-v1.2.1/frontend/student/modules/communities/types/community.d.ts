interface User {
  data?: User
  id: string
  username: string
  fullName: string
  major: string
}

interface CreateSnackbarNotify {
  name: string
  title: string
  type: string
}

interface Questionnaire {
  th: string
  en: string
}

interface Answer {
  type?: string
  value?: number
  answer?: string
}

interface AnswerResponse {
  id: string
  questionnaire: questionnaire
  answer: Answer
}

interface Request {
  sender: string
  receiver: string
  questions: AnswerResponse[]
}

interface ErrorResponse {
  response: {
    _data: {
      message: string
    }
  }
}

interface INotification {
  title: {
    th: string
    en: string
  }
  subtitle: {
    th: string
    en: string
  }
  detail: {
    th: string
    en: string
  }
  icon: string
  image: string
  redirect: string
  redirectMessage: {
    th: string
    en: string
  }
  timeStamp?: Date
}

interface FriendRequest {
  id?: string
  sender: User
  receiver: User
  questions: {
    questionnaire: Questionnaire
    answer: string
    messages: string
  }[]
}

interface Relationship {
  data?: Relationship
  sender: User
  receiver: User
  friendCount?: number
}

interface FriendsList {
  userId: string
  fullName: string
  major: {
    th: string
    en: string
  }
  friendCount: number
  rank: number
}

interface Major {
  id?: string
  data?: Major
  name: {
    th: string
    en: string
  }
  acronym: string
}

interface Gift {
  sendergift: User
  receivergift: User
  point: number
  isSended: boolean
}

interface Room {
  id: string
  name: { th: string; en: string }
  people: string
  roomImage: string
}

interface Question {
  id: string
  questionnaire: { [key: string]: string }
  answer: string
}