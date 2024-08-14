interface UserModel {
  id: string
  fullName: string
  username: string
}

interface CheckInsModel {
  id: string
  user: string
  activity: string
}

interface ActivitiesModel {
  id: string
  name: {
    th: string
    en: string
  }
}

interface editCheckInInputModel {
  student: string
  activity: string
  title: string
  value: string
  checkInId: string
}
