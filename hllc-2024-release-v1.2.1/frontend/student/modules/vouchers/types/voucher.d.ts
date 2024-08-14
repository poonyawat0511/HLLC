interface Condition {
    id: string
    en: string
    th: string
}

interface Voucher {
  id: string
  discount: { th: string; en: string }
  voucherImages: {
    main : string
    front : string
    back : string
  }
  sponsor: {
    id: string
    name: { th: string; en: string }
    logo: string
    no: number
    type: string
  }
  exp: Date
  acronym: string
  type: string
  condition: Condition[]
}

interface VoucherCode {
    id: string
    voucher: Voucher 
    user: string | null
    code: string
    type: string
}

interface voucherExists{
  voucher: Voucher 
  exists : boolean
  availableVoucher : boolean
}

interface SponsorSetting {
  isLoaded: boolean
  dateTimes: {
    open?: Date | null
    close?: Date | null
  }
  note?: { th: string; en: string }
  howToGetVoucher: { th: string[]; en: string[] }
  howToUseVoucher: { th: string[]; en: string[] }
}