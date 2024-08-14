import { reactive } from '#imports'

const avatars = reactive<SchoolAvatar>({
  1: '',
  2: '',
  3: '',
  4: '',
})

const colors = reactive<Record<string, string>>({})
const assets = reactive<Record<string, string>>({})

export type SchoolProvider = {
  photos: { first: string; second: string; third: string; fourth: string }
  colors: Record<string, string>
  assets: Record<string, string>
} & Record<string, unknown>

export type SchoolAvatar = {
  1: string
  2: string
  3: string
  4: string
}

export const useSchool = () => {
  function init(school: SchoolProvider) {
    // Set school avatar
    avatars[1] = school.photos.first
    avatars[2] = school.photos.second
    avatars[3] = school.photos.third
    avatars[4] = school.photos.fourth

    // Set school colors
    Object.assign(colors, school.colors)
    // Set school assets
    Object.assign(assets, school.assets)
  }

  function avatar(v: keyof SchoolAvatar) {
    return avatars[v]
  }

  return {
    init,
    avatars,
    avatar,
    colors,
    assets,
  }
}
