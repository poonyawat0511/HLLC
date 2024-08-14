interface Activity {
  id?: string
  name: { th: string; en: string }
  shortName: { th: string; en: string }
  code: string
  type: 0 | 1
  description: { th: string; en: string }
  shortDesc: { th: string; en: string }
  banner: string
  icon: string
  open: boolean
  progress: boolean
  show: boolean
}

interface ActivitySetting {
  id?: string
  activity: Activity | string | null
  major: MajorEntity | string | null
  location: { th: string; en: string }
  dateTime: { start: Date | string; end: Date | string }
  scopes: Roles[]
}
