interface Evolution {
  id: string
  item: string
  user: string
  isUsed: boolean
  useAt: Date
}

const levels = ['level1', 'level2', 'level3'] as const
const images = ['mission', 'item', 'secret'] as const

type Levels = (typeof levels)[number]
type Images = (typeof images)[number]

type EvolutionSetting = {
  [K in Levels]: number
} & {
  images: {
    [K in Images]: string
  }
}
