type Title = 'Home' | 'Activities' | 'QR Code' | 'E-voucher' | 'Notifications'
type TitleExpansions = 'Fresher Contest' | 'Lamduan Origami' | 'Special Activity' | 'Community' | 'Questions'

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
  SelectNavigation<'Notifications'>
]

interface ExpansionMenu {
  title: string
  icon: string
  to: string
  value?: unknown
}

type SelectNavigationExpansion<T extends TitleExpansions> = {
  title: T
  icon: string
  to: string
  value?: unknown
}

type NavigationExpansionList = [
  SelectNavigationExpansion<'Fresher Contest'>,
  SelectNavigationExpansion<'Lamduan Origami'>,
  SelectNavigationExpansion<'Special Activity'>,
  SelectNavigationExpansion<'Community'>,
  SelectNavigationExpansion<'Questions'>,
]

interface TabItem {
  value: string
  title: { en: string; th: string }
}

