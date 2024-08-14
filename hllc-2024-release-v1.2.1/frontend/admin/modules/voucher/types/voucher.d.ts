interface VoucherCode {
  id: string
  voucher: IVoucher
  user?: {
    username: string
  }
  code: string
  type: string
}
interface Condition {
  id: string
  en: string
  th: string
}
interface VoucherModel {
  id: string
  discount: {
    th: string
    en: string
  }
  condition: [
    {
      th: string
      en: string
      id: string
    }
  ]
  voucherImages: {
    main: string | File
    front: string | File
    back: string | File
  }
  sponsor: ISponsor
  exp: Date
  acronym: string
  type: string
}

interface ICreateVoucher {
  id: string
  acronym: string
  count: string
  voucher: string
}
interface IEditVoucher extends ICreateVoucher {
  user?: {
    username: string
  }
  type?: string
}
//for search user
interface UserModel {
  id: string
  fullName: string
  username: string
}