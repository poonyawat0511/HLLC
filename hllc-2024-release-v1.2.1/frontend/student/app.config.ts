export default defineAppConfig({
  menus: [
    {
      title: 'Home',
      to: '/',
      icon: 'mdi-home',
      badge: false,
    },
    {
      title: 'Activities',
      to: '/activities',
      icon: 'mdi-calendar',
      badge: false,
    },
    {
      title: 'QR Code',
      to: '/qr-code',
      icon: 'mdi-qrcode',
      badge: false,
    },
    {
      title: 'E-voucher',
      to: '/e-voucher',
      icon: 'mdi-wallet-giftcard',
      badge: false,
    },
    {
      title: 'Notifications',
      to: '/notifications',
      icon: 'mdi-bell',
      badge: false,
    },
  ],

  expansions: [
    {
      title: 'Fresher Contest',
      icon: 'mdi-theater',
      to: '/contest',
    },
    {
      title: 'Lamduan Origami',
      icon: 'mdi-flower',
      to: '/lamduan',
    },
    {
      title: 'Special Activity',
      icon: 'mdi-calendar',
      to: '/khantoke',
    },
    {
      title: 'Community',
      icon: 'mdi-account-group',
      to: '/community',
    },
    {
      title: 'Questions',
      icon: 'mdi-account-group',
      to: '/questions',
    },
  ],

  icons: {
    error: 'icons/warning.png',
    success: 'icons/success.png',
    warning: 'icons/warning.png',
  },

  button: {
    text: {
      variant: 'text',
      rounded: 'xl',
    },
    primary: {
      color: 'primary',
      variant: 'flat',
      rounded: 'xl',
    },
    secondary: {
      color: 'secondary',
      variant: 'flat',
      rounded: 'xl',
    },
    error: {
      color: 'error',
      variant: 'flat',
      rounded: 'xl',
    },
    success: {
      color: 'success',
      variant: 'flat',
      rounded: 'xl',
    },
    warning: {
      color: 'warning',
      variant: 'flat',
      rounded: 'xl',
    },
  },
})
