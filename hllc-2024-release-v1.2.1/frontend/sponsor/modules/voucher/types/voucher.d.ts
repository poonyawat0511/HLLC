interface Voucher {
  id: string
  discount: { th: string; en: string }
  voucherImage: string
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
}
  
  interface VoucherCode {
    id: string
    voucher: string
    user: string | null
    code: string
    type: string
}

  interface User {
    id: string
    username: string
    fullName: string
    major: string
  }

  interface UpdateVoucherCode {
    user : User
    Voucher : Voucher
  }
