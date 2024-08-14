interface voucherExists {
  voucher: Voucher
  exists: boolean
  availableVoucher: boolean
}

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

export function useVoucher() {
  /** Sponsor settting */
  const setting = useState<SponsorSetting>('sponsor:setting', () => ({
    isLoaded: false,
    dateTimes: {},
    note: { th: '', en: '' },
    howToGetVoucher: { th: [], en: [] },
    howToUseVoucher: { th: [], en: [] },
  }))
  const vouchers = useState<VoucherCode[]>('voucher:vouchers', () => [])
  const voucherGifts = useState<voucherExists[]>(
    'voucher:voucherGift',
    () => []
  )
  const voucher = useState<VoucherCode | null>('voucher:voucher', () => null)
  const isVouchersFetch = useState<boolean>(
    'voucher:isVouchersFetch',
    () => false
  )
  const isVoucherGiftFetch = useState<boolean>(
    'voucher:isVoucherGiftFetch',
    () => false
  )

  const isOpen = computed<boolean>(() => {
    const currentTime = new Date()
    if (!setting.value.dateTimes.open || !setting.value.dateTimes.close) {
      return true
    }
    return (
      currentTime?.getTime() >= setting.value.dateTimes.open?.getTime() 
    )
  })

  const isClosed = computed(() => {
    const currentTime = new Date()
    if (!setting.value.dateTimes.close) {
      return false
    }
    return currentTime >= setting.value.dateTimes.close
  })

  const { $api } = useApi()
  const { data: user } = useAuth()
  const adpater = useDate()
  /**
   * A function that get voucher settings
   * @param deep reload if setting is loaded
   */
  const loadSetting = async (deep?: boolean) => {
    if (!deep && setting.value.isLoaded) return
    try {
      const response = await $api.get<SettingResponse>(
        `/settings/group/sponsor`
      )
      // Transform settings into a JSON object
      const settings = response.data
  

      const object = Object.fromEntries(
        settings.map((setting) => [setting.key, setting])
      )
      // Transform date
      const dateTiems = {
        open: object['sponsor:open'],
        close: object['sponsor:close'],
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

      // Setting note 
      const note = {
        th: object['sponsor:note:th'],
        en: object['sponsor:note:en'],
      }
      setting.value.note = {
        th: note.th?.type === 'text' ? note.th?.value : '',
        en: note.en?.type === 'text' ? note.en?.value : '',
      }
  
      // Setting how to use sponson th
      const howToGetVoucher = {
        th: object['sponsor:howToGetVoucher:th'],
        en: object['sponsor:howToGetVoucher:en'],
      }
      if (howToGetVoucher.th?.type === 'array') {
        setting.value.howToGetVoucher.th =
          howToGetVoucher.th?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting how to use sponson en
      if (howToGetVoucher.en?.type === 'array') {
        setting.value.howToGetVoucher.en =
          howToGetVoucher.en?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting how to use sponson th
      const howToUseVoucher = {
        th: object['sponsor:howToUseVoucher:th'],
        en: object['sponsor:howToUseVoucher:en'],
      }
      if (howToUseVoucher.th?.type === 'array') {
        setting.value.howToUseVoucher.th =
          howToUseVoucher.th?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }
      // Setting how to use sponson en
      if (howToUseVoucher.en?.type === 'array') {
        setting.value.howToUseVoucher.en =
          howToUseVoucher.en?.value
            ?.filter((item) => item.type === 'text')
            .map<string>((item) => item.value ?? '') ?? []
      }

      // Set state is fetched
      setting.value.isLoaded = true
    } catch (error) {
      console.error('Error fetching contest date:', error)
    }
  }

  /**
   * A function to get all vouchers
   * @param deep - reload wheter the voucher is loaded
   */
  const fetchVouchers = async (deep?: boolean) => {
    if (!deep && isVouchersFetch.value) return
    try {
      const response = await $api.get<{ data: VoucherCode[] }>(
        `/voucher-codes/${user?.value.id}/user`
      )
      vouchers.value = response.data
      isVouchersFetch.value = true
    } catch (error) {
      console.error('Error fetching voucher', error)
      throw error
    }
  }

  /**
   * A function to get all voucher gift
   * @param deep - reload wheter the voucher is loaded
   */
  const fetchVoucherGift = async (deep?: boolean) => {
    if (!deep && isVoucherGiftFetch.value) return
    try {
      const response = await $api.get<{ data: voucherExists[] }>(
        '/voucher-codes/exists'
      )
      voucherGifts.value = response.data
      isVoucherGiftFetch.value = true
    } catch (error) {
      console.error('Error fetching voucher', error)
      throw error
    }
  }

  /**
   * A function to pick voucher
   * @param item
   */
  const submit = async (item: voucherExists | null) => {
    try {
      if (!item) {
        throw new Error('No voucher selected')
      }
      const id = item.voucher.id
      try {
        const response = await $api.get<{ data: VoucherCode }>(
          `/voucher-codes/${id}/voucher`
        )
        voucher.value = response.data
        try {
          await $api.put<VoucherCode>(`/voucher-codes/${voucher.value.id}`, {
            body: JSON.stringify({ user: user.value.id }),
          })
          await fetchVoucherGift(true)
          await fetchVouchers(true)
        } catch (error) {
          console.error('Error updating voucher:', error)
          throw error
        }
      } catch (error) {
        console.error('Error fetching voucherCode id', id, error)
        throw error
      }
    } catch (error) {
      console.error('Error submitting voucher', error)
      throw error
    }
  }

  /**
   * A function to pick voucher
   * @param item
   */
  const use = async (item: VoucherCode | null) => {
    try {
      if (!item) {
        throw new Error('No voucher selected')
      }
      const id = item.id
      try {
        await $api.put<VoucherCode>(`/voucher-codes/${id}`, {
          body: JSON.stringify({ type: 'USED' }),
        })
        await fetchVouchers(true)
      } catch (error) {
        console.error('Error updating voucher:', error)
        throw error
      }
    } catch (error) {
      console.error('Error submitting voucher', error)
      throw error
    }
  }

  // Computed property for sorted vouchers
  const sortedVoucher = computed(() => {
    const currentDate = new Date();
  
    return vouchers.value.slice().sort((a, b) => {
      const expA = a.voucher.exp ? new Date(a.voucher.exp) : null;
      const expB = b.voucher.exp ? new Date(b.voucher.exp) : null;
  
      if (expA && expA > currentDate && (!expB || expB <= currentDate)) {
        return -1;
      }
      if (expB && expB > currentDate && (!expA || expA <= currentDate)) {
        return 1;
      }
  
      if (a.type === 'UNUSED' && b.type === 'USED') {
        return -1;
      }
      if (a.type === 'USED' && b.type === 'UNUSED') {
        return 1;
      }
  
      return 0;
    });
  });
  
    

  return {
    fetchVouchers,
    fetchVoucherGift,
    voucherGifts,
    loadSetting,
    setting,
    sortedVoucher,
    submit,
    isOpen,
    isClosed,
    use,
  }
}
