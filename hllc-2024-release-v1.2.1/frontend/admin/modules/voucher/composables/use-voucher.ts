export function useVoucher() {
  /** State for checking that favorite is fetched */
  const isFetch = useState<boolean>('voucher:isFetch', () => false)
  const voucherCodes = useState<VoucherCode[]>('voucher:voucherCode', () => [])
  const vouchersData = ref<VoucherModel[]>([])
  const userData = useState<UserModel[]>('user:userData', () => [])
  // API plugin
  const { $api } = useApi()

  /**
   * A function to get all voucher code
   * @param deep - reload wheter the contest is loaded
   */
  const fetchVoucherCode = async (deep?: boolean) => {
    if (!deep && isFetch.value) return
    try {
      const reponse = await $api.get<{ data: VoucherCode[] }>('/voucher-codes')
      voucherCodes.value = reponse.data
      isFetch.value = true
    } catch (error) {
      console.error('Error fetching content', error)
      throw error
    }
  }

  const fetchVoucher = async () => {
    try {
      const response = await $api.get<{ data: VoucherModel[] }>('/vouchers')
      vouchersData.value = response.data
    } catch (error) {
      console.error('Error fetching activities:', error)
      vouchersData.value = []
    }
  }  
  /**
   * Function to create a new voucher code
   * @param voucherCodeData - Data for the new voucher code
   */
  const createVoucherCode = async (voucherCodeData: Partial<VoucherCode>) => {
    try {
      const response = await $api.post<{ data: VoucherCode }>(
        '/voucher-codes/generate',
        { body: voucherCodeData }
      )
      const newVoucherCode = response.data
      await fetchVoucherCode(true)
      return newVoucherCode
    } catch (error) {
      console.error('Error creating voucher code', error)
      throw error
    }
  }
  const updateVoucher = async (voucherId: string, editData: IEditVoucher) => {
    try {
      const res = await $api.get<{ data : UserModel[] }>(`/users/search/${editData.user}`)
      userData.value = res.data
      
      try {
        const data = { user : userData.value.id, type:editData.type }
        const response = await $api.put<{ data: VoucherModel }>(`/voucher-codes/${voucherId}`, { body: data })
        const updatedVoucher = response.data
        // Assuming vouchersData is reactive, update the local data
        const index = voucherCodes.value.findIndex(voucher => voucher.id === voucherId)
        if (index !== -1) {
          // Update only user and type fields
          if (editData.user) {
            voucherCodes.value[index].user = editData.user
          }
          if (editData.type) {
            voucherCodes.value[index].type = editData.type
          }
        }
        await fetchVoucherCode(true)
        return updatedVoucher
      } catch (error) {
        console.error(`Error updating voucher ${voucherId}`, error)
        throw error
      }
    } catch (error) {
      console.error(`Error get data user ${voucherId}`, error)
      throw error
    }
  }
  
  // search user
  const searchUser = async (username: string) => {
    try {
      const response = await $api.get<ApiResponse<UserModel>>(
        `/users/search/${username}`
      )
      if (response.statusCode === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error searching users:', error)
      throw error
    }
  }
  const deleteVoucher = async (voucherId: string) => {
    try {
      await $api.delete(`/voucher-codes/${voucherId}`)
      await fetchVoucherCode(true)
    } catch (error) {
      console.error(`Error deleting voucher ${voucherId}:`, error)
      throw error
    }
  }
  return {
    fetchVoucherCode,
    fetchVoucher,
    createVoucherCode,
    searchUser,
    updateVoucher, 
    deleteVoucher,
    voucherCodes,
    vouchersData,
  }
}
