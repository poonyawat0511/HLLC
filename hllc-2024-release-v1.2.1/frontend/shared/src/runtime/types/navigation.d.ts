type Title = 'Home' | 'Activities' | 'QR Code' | 'E-voucher' | 'Notifications'

interface MenuItem {
  title: Title
  to: string
  icon: string
  badge: boolean
}

type SelectNavigation<T extends Title> = {
  title: T
  to: string
  icon: string
  badge: boolean
}

type NavigationList = [
  SelectNavigation<'Home'>,
  SelectNavigation<'Activities'>,
  SelectNavigation<'QR Code'>,
  SelectNavigation<'E-voucher'>,
  SelectNavigation<'Notifications'>,
]
