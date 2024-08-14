interface EvaluationItem {
  isUsed: boolean
  timestamp: Date
}

interface Evaluation {
  author: string

  activity: string

  timestamp: Date

  item: EvaluationItem
}
