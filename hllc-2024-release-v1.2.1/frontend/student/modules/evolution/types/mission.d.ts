type Mission =
  | {
      status: 'coming soon' | 'waiting' | 'failed'
      message: { th: string; en: string }
      start: { th: string; en: string }
      end: { th: string; en: string } | null
      index: number
      image: string
      id: string
    }
  | {
      status: 'success'
      message: { th: string; en: string }
      start: { th: string; en: string }
      end: { th: string; en: string } | null
      index: number
      timestamp: { th: string; en: string }
      image: string
      id: string
    }
