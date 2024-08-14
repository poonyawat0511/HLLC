interface Item {
  id: string
  name: {
    th: string
    en: string
  }
  description: {
    th: string
    en: string
  }
  image: string
  activity: string
  evolution: Evolution | null
}
