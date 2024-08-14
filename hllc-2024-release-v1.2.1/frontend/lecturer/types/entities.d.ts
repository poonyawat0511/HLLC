interface SchoolEntity {
  id: string
  name: {
    th: string
    en: string
  }
  acronym: string
  detail: {
    th: string
    en: string
  }
  photos: {
    first?: string
    second?: string
    third?: string
    fourth?: string
  }
}

interface MajorEntity {
  id: string
  name: {
    th: string
    en: string
  }
  acronym: string
  detail: {
    th: string
    en: string
  }
  school?: SchoolEntity
}

interface ThemeEntity {
  id: string
  school: string | SchoolEntity
  assets: Record<string, string>
  colors: Record<string, string>
}
