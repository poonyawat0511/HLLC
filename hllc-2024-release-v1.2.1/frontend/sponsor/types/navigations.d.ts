interface NavigationItem {
  title: string
  to: string
  icon: string
}

interface BreadcrumbItem {
  title: string
  to: string
  disabled?: boolean
}

type MenuItem = {
  module: string
  children: NavigationItem[]
}

type UserMenuItem = {
  icon: string
  badge: boolean
  to: string
  title: string
}
