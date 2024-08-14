type ActivityStatus =
  | { step: 0; message: 'not started' | 'closing' }
  | { step: 1; message: 'waiting' | 'failed' }
  | { step: 2; message: 'waiting' }
  | { step: 3; message: 'success' | 'waiting' }

interface IActivity {
  id: string
  name: {
    th: string
    en: string
  }
  shortName: {
    th: string
    en: string
  }
  code: string
  type: number
  description: {
    th: string
    en: string
  }
  shortDesc: {
    th: string
    en: string
  }
  banner: string
  icon: string
  open: boolean
  progress: boolean
  show: boolean
  location: {
    th: string
    en: string
  }
  dateTime: {
    start: null
    end: null
  }
  status: ActivityStatus
  checkInAt: Date | null
  takeAssessmentAt: Date | null
}

interface ActivityQuestion {
  id: string
  question: {
    th: string
    en: string
  }
  type: string
  required: string
  activity: string
  value?: string
}

interface AnswerQuestion {
  author: string
  values: { assessment: string; value: string }[]
}

interface CheckIn {
  user: string
  activity: string
  staff: string
  timestamp: Date
}

interface Assessment {
  author: string
  activity: string
  timestamp: Date
}
