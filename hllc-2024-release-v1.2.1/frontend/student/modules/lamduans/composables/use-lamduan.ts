type SettingType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'timestamp'
  | 'image'
  | 'array'

type ArrayValueType = Exclude<SettingType, 'array' | 'image'>

type ArrayValue = {
  [K in ArrayValueType]: {
    type: K
    value?: Setting[K]
  }
}[ArrayValueType]

type SettingValue =
  | Date
  | number
  | string
  | boolean
  | ArrayValue[]
  | null
  | undefined

interface Setting extends Record<SettingType, SettingValue> {
  text: string
  number: number
  date: Date | null | undefined
  time: Date | null | undefined
  timestamp: Date | null | undefined
  image: string
  boolean: boolean
  array: ArrayValue[]
}

type SettingEntity = {
  [K in SettingType]: {
    id?: string
    key: string
    value?: Setting[K]
    type: K
    group?: string
    description?: string
  }
}[SettingType]

interface SettingResponse {
  statusCode: number
  message: string
  data: SettingEntity[]
}

export function useLamduan() {
  const lamduanActivities = useState<IActivity | null>(
    'lamduan:lamduanActivities',
    () => null
  )
  const lamduan = useState<Lamduan | null>('lamduan:lamduan', () => null)
  const isLamduanFetch = useState<boolean>(
    'lamduan:isLamduanFetch',
    () => false
  )
  const isLamduanActivitiesFetch = useState<boolean>(
    'lamduan:isLamduanActivitiesFetch',
    () => false
  )
  const setting = useState<LamduanSetting>('lamduan:setting', () => ({
    isLoaded: false,
    dateTimes: {},
    youtube: '',
    tutorial: '',
  }))

  // API plugin
  const { $api } = useApi()
  const { data: user } = useAuth()
  const adpater = useDate()

  /** Check is lamduan is open or not */
  const isOpen = computed<boolean>(() => {
    const currentTime = new Date()
    if (!setting.value.dateTimes.open || !setting.value.dateTimes.close) {
      return true
    }
    return (
      currentTime?.getTime() >= setting.value.dateTimes.open?.getTime() &&
      currentTime?.getTime() <= setting.value.dateTimes.close?.getTime()
    )
  })

  const isClosed = computed(() => {
    const currentTime = new Date()
    if (!setting.value.dateTimes.close) {
      return false
    }
    return currentTime >= setting.value.dateTimes.close
  })

  /**
   * A function that get lamduan settings
   * @param deep reload if setting is loaded
   */
  const loadSetting = async (deep?: boolean) => {
    if (!deep && setting.value.isLoaded) return
    try {
      const response = await $api.get<SettingResponse>(
        `/settings/group/lamduan`
      )
      // Transform settings into a JSON object
      const settings = response.data

      const object = Object.fromEntries(
        settings.map((setting) => [setting.key, setting])
      )
      // Transform date
      const dateTiems = {
        open: object['lamduan:open'],
        close: object['lamduan:close'],
      }
      setting.value.dateTimes = {
        open:
          dateTiems.open.type === 'timestamp'
            ? (adpater.date(dateTiems.open.value) as Date)
            : null,
        close:
          dateTiems.close.type === 'timestamp'
            ? (adpater.date(dateTiems.close.value) as Date)
            : null,
      }

      // Setting youtube
      const youtube = object['lamduan:youtube']
      if (youtube.type === 'text') {
        setting.value.youtube = youtube.value ?? ''
      }

      // Setting tutorial
      const tutorial = object['lamduan:tutorial']
      if (tutorial.type === 'image') {
        setting.value.tutorial = tutorial.value ?? ''
      }

      // Set state is fetched
      setting.value.isLoaded = true
    } catch (error) {
      console.error('Error fetching contest date:', error)
    }
  }

  /**
   * A function that get lamduan user
   * @param deep
   */
  const fetchLamduan = async (deep?: boolean) => {
    if (!deep && isLamduanFetch.value) return
    try {
      const response = await $api.get<{ data: Lamduan | null }>(
        `/users/${user?.value.id}/lamduans`
      )
      lamduan.value = response.data
      isLamduanFetch.value = true
    } catch (error) {
      lamduan.value = null
      isLamduanFetch.value = false
      console.error('Error fetching voucher', error)
      throw error
    }
  }

  /**
   * A function that get activity lamduan
   * @param deep
   */
  const fetchActivitiesLamduan = async (deep?: boolean) => {
    if (!deep && isLamduanActivitiesFetch.value) return
    try {
      const response = await $api.get<{ data: IActivity }>(
        `/activities/LAMDUAN/code`
      )
      lamduanActivities.value = response.data
      console.log(lamduanActivities.value)
      isLamduanActivitiesFetch.value = true
    } catch (error) {
      console.error('Error fetching voucher', error)
      throw error
    }
  }

  const submit = async (item: Lamduan) => {
    try {
      if (!item) {
        throw new Error('No lamduan selected')
      }
      const data = {
        user: user.value.id,
        text: item.text,
        lamduanImage: item.lamduanImage,
      }
      await $api.post<Lamduan>('/lamduans', { body: objectToFormData(data) })
      fetchLamduan(true)
      fetchActivitiesLamduan(true)
    } catch (error) {
      console.error('Error submitting lamduan', error)
      throw error
    }
  }

  const edit = async (item: Lamduan) => {
    try {
      if (!item) {
        throw new Error('No lamduan selected')
      }
      const data = {
        id: item.id,
        user: user.value.id,
        text: item.text,
        lamduanImage: item.lamduanImage,
      }
      await $api.put<Lamduan>(`/lamduans/${item.id}`, {
        body: objectToFormData(data),
      })
      fetchLamduan(true)
    } catch (error) {
      console.error('Error submitting lamduan', error)
      throw error
    }
  }
  return {
    fetchLamduan,
    submit,
    lamduan,
    loadSetting,
    setting,
    isOpen,
    isClosed,
    fetchActivitiesLamduan,
    lamduanActivities,
    edit,
  }
}
