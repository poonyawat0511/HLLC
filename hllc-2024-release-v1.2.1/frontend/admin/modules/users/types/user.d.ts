interface IMajor {
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
  school: SchoolEntity
}

interface IUser {
  id: string
  name: { first: string; last: string }
  username: string
  major?: IMajor
  type: string
  round: string
  fullName: string
}
