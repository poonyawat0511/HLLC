interface IVoucher {
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
