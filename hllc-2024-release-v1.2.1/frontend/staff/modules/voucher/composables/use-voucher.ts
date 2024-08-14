export function useVoucher() {
  /** State for checking that favorite is fetched */
  const isFetch = useState<boolean>('voucher:isFetch', () => false)
  /** data voucher */
  const vouchers = useState<Voucher[]>('voucher:voucher', () => [])

  // API plugin
  const { $api } = useNuxtApp()
  /**
   * A function to get all voucher code
   * @param deep - reload wheter the contest is loaded
   */
  const fetchVoucher = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const reponse = await $api.get<{ data: Voucher[] }>('/vouchers')
      vouchers.value = reponse.data
      isFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }
  return {
    fetchVoucher,
    vouchers,
  }
}
