import { shuffleArray } from '../utils/suffle-array'
import { FetchError } from 'ofetch'

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

interface VoteResponse {
  statusCode: number
  message: string
  data: {
    author: string
    current?: Contest | null
    histories: { content: Contest | string; timestamp: Date }[]
  }
}

export function useContest() {
  /** Contest settting */
  const setting = useState<ContestSetting>('contest:setting', () => ({
    isLoaded: false,
    dateTimes: {},
    banner: '',
    howToVote: { th: [], en: [] },
    taglines: { th: [], en: [] },
    details: { th: '', en: '' },
    final: { th: '', en: '' },
  }))
  /** Current favorite contest of the user */
  const favorite = useState<Contest | null>('contest:favorite', () => null)
  /** State for checking that favorite is fetched */
  const isFetch = useState<boolean>('contest:isFetch', () => false)
  /** Randon content */
  const contents = useState<Contest[]>('contest:contents', () => [])
  /** State for checking that contents is fetched */
  const isContentsFetch = useState<boolean>(
    'contest:isContentsFetch',
    () => false
  )

  /** Check is vote is open or not */
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

  // API plugin
  const { $api } = useApi()
  const adpater = useDate()

  /**
   * A function that get contest settings
   * @param deep reload if setting is loaded
   */
  const loadSetting = async (deep?: boolean) => {
    if (!deep && setting.value.isLoaded) return
    try {
      const response = await $api.get<SettingResponse>(
        `/settings/group/contest`
      )
      // Transform settings into a JSON object
      const settings = response.data
      const object = Object.fromEntries(
        settings.map((setting) => [setting.key, setting])
      )
      // Transform date
      const dateTiems = {
        open: object['contest:open'],
        close: object['contest:close'],
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
      // Setting details
      const details = {
        th: object['contest:details:th'],
        en: object['contest:details:en'],
      }
      setting.value.details = {
        th: details.th?.type === 'text' ? details.th?.value : '',
        en: details.en?.type === 'text' ? details.en?.value : '',
      }
      // Setting how to vote th
      const howToVote = {
        th: object['contest:howToVote:th'],
        en: object['contest:howToVote:en'],
      }
      if (howToVote.th?.type === 'array') {
        setting.value.howToVote.th =
          howToVote.th?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting how to vote en
      if (howToVote.en?.type === 'array') {
        setting.value.howToVote.en =
          howToVote.en?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting banner
      const banner = object['contest:banner']
      if (banner?.type === 'image') {
        setting.value.banner = banner.value ?? ''
      }
      // Setting taglines th
      const taglines = {
        th: object['contest:taglines:th'],
        en: object['contest:taglines:en'],
      }
      if (taglines.th?.type === 'array') {
        setting.value.taglines.th =
          taglines.th?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting taglines en
      if (taglines.en?.type === 'array') {
        setting.value.taglines.en =
          taglines.en?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting details
      const final = {
        th: object['contest:final:th'],
        en: object['contest:final:en'],
      }
      setting.value.final = {
        th: final.th?.type === 'text' ? final.th?.value : '',
        en: final.en?.type === 'text' ? final.en?.value : '',
      }
      // Set state is fetched
      setting.value.isLoaded = true
    } catch (error) {
      console.error('Error fetching contest date:', error)
    }
  }

  /**
   * A function to vote favorite contest for logged in user
   * @param contest
   */
  const vote = async (contest: Contest) => {
    try {
      const body = { contestId: contest.id }
      const response = await $api.post<VoteResponse>('/contests/vote', { body })
      const item = contents.value.find((v) => v.id === contest.id)
      if (item) {
        if (item.votes) item.votes++
        else item.votes = 1
      }
      const like = contents.value.find((v) => v.id === favorite.value?.id)
      if (like) {
        if (like.votes) like.votes--
        else like.votes = 1
      }
      favorite.value = response.data.current ?? null
      if (favorite.value) {
        favorite.value.votes = item?.votes ?? 0
      }
    } catch (error) {
      console.error('Error voting content', error)
      throw error
    }
  }

  /**
   * A function to unvote favorite contest for logged in user
   * @param contest
   */
  const unvote = async (contest: Contest) => {
    try {
      await $api.delete<VoteResponse>('/contests/vote')
      const item = contents.value.find((v) => v.id === contest?.id)
      if (item) {
        if (item.votes) item.votes--
        else item.votes = 0
      }
      if (favorite.value) {
        favorite.value.votes = item?.votes ?? 0
      }
      favorite.value = null
    } catch (error) {
      console.error('Error unvoting content', error)
      throw error
    }
  }

  /**
   * A function to get current favorite contest of logged in user
   * @param deep - reload wheter the contest is loaded
   */
  const fetchFovorite = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const reponse = await $api.get<VoteResponse>('/contests/vote')
      favorite.value = reponse.data.current ?? null
      isFetch.value = true
    } catch (error) {
      if (error instanceof FetchError && error.statusCode === 404) {
        favorite.value = null
        isFetch.value = true
      } else {
        console.error('Error fetching content', error)
        throw error
      }
    }
  }

  /**
   * A function to get all fresher contents
   * @param deep - reload wheter the contest is loaded
   */
  const fetchContests = async (deep?: boolean) => {
    if (!deep && isContentsFetch.value) return
    try {
      const response = await $api.get<{ data: Contest[] }>('/contests')
      contents.value = response.data
      isContentsFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }

  /**
   * A function to get a contest by id
   * @param id - the id of the contest
   * @param deep - reload wheter the contest is loaded
   */
  const findOne = async (id: string, deep?: boolean) => {
    if (!deep) {
      const item = contents.value.find((item) => item.id === id)
      if (item) return Object.assign({}, item)
    }
    try {
      const response = await $api.get<{ data: Contest }>(`/contests/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching content id', id, error)
      throw error
    }
  }

  /**
   * Match item with search query
   * @param query - Search keywords
   * @param item - Item to match against the query
   * @returns
   */
  const match = (query: string, item: Contest) => {
    const titleMatch =
      item.title?.en?.toLowerCase().includes(query) ||
      item.title?.th?.toLowerCase().includes(query)
    const teamMatch = item.team?.toLowerCase().includes(query)
    const categoryMatch =
      item.category?.en?.toLowerCase().includes(query) ||
      item.category?.th?.toLowerCase().includes(query)
    return titleMatch || teamMatch || categoryMatch
  }

  /**
   * A function to filter the contents by keywords
   * @param keywords keywords to search
   * @param take number of value to get
   * @param excludes ids of contest to excludes
   */
  const random = (keywords?: string, take?: number, excludes?: string[]) => {
    const items = shuffleArray<Contest>(
      contents.value.filter(
        (contest) =>
          contest.id !== favorite.value?.id && !excludes?.includes(contest.id)
      )
    )
    if (!keywords) {
      if (take) return items.slice(0, take)
      return items
    }
    const query = keywords.toLowerCase()
    const filterItems = items.filter((contest) => match(query, contest))
    if (take) return filterItems.slice(0, take)
    return filterItems
  }

  /**
   * A function to get top teir content
   * @param take number of contests
   */
  const top = (take: number) => {
    return contents.value
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, take)
  }

  return {
    setting,
    loadSetting,
    favorite,
    fetchFovorite,
    vote,
    unvote,
    fetchContests,
    contents,
    random,
    isOpen,
    isClosed,
    findOne,
    top,
  }
}
