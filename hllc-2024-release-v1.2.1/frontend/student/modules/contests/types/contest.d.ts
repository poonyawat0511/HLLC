interface ContestSetting {
  banner: string
  isLoaded: boolean
  dateTimes: {
    open?: Date | null
    close?: Date | null
  }
  howToVote: { th: string[]; en: string[] }
  taglines: { th: string[]; en: string[] }
  details: {
    th?: string
    en?: string
  }
  final: {
    th?: string
    en?: string
  }
}

interface Contest {
  id: string
  team: string
  category: { th: string; en: string }
  title: { th: string; en: string }
  description: { th: string; en: string }
  members: { name: string; studentId: string }[]
  coverImage: string
  url: string
  votes?: number
}
