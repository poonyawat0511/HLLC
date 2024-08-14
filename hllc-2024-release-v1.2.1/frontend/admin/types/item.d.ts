interface Item {
  id?: string
  name: { th: string; en: string }
  description: { th?: string; en?: string }
  activity: string
  image?: string | null | File
}
