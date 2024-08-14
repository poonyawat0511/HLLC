export default defineAppConfig({
  menus: [
    {
      module: 'System Controller',
      children: [
        {
          to: '/dashboard',
          icon: 'mdi-chart-pie',
          title: 'Dashboard',
        },
        {
          to: '/settings',
          icon: 'mdi-cog',
          title: 'System Settings',
        },
        {
          to: '/reports',
          icon: 'mdi-alert-octagon',
          title: 'User Reports',
        },
        {
          to: '/notifications',
          icon: 'mdi-bell-ring',
          title: 'Notifications',
        },
        {
          to: '/sponsors',
          icon: 'mdi-cash-multiple',
          title: 'System Sponsor',
        },
        {
          to: '/themes',
          icon: 'mdi-palette',
          title: 'Themes',
        },
      ],
    },
    {
      module: 'Activity Management',
      children: [
        {
          to: '/activities',
          icon: 'mdi-calendar-edit',
          title: 'Activities',
        },
        {
          to: '/evolutions',
          icon: 'mdi-chevron-triple-up',
          title: 'Evolutions',
        },
        {
          to: '/assessments',
          icon: 'mdi-file-document-edit',
          title: 'Assessments',
        },
        {
          to: '/contests',
          icon: 'mdi-theater',
          title: 'Fresher Contest',
        },
        {
          to: '/lamduans',
          icon: 'mdi-flower-tulip',
          title: 'Lamduan Flowers',
        },
      ],
    },
    {
      module: 'User Management',
      children: [
        {
          to: '/users',
          icon: 'mdi-account-cog',
          title: 'Users',
        },
        {
          to: '/admins',
          icon: 'mdi-shield-account',
          title: 'Admins',
        },
        {
          to: '/schools',
          icon: 'mdi-school',
          title: 'Schools',
        },
        {
          to: '/users/reset-password',
          icon: 'mdi-lock-reset',
          title: 'Reset Password',
        },
        {
          to: '/users/progress',
          icon: 'mdi-percent-circle',
          title: 'Progress Management',
        },
        {
          to: '/manage-room',
          icon: 'mdi-sofa-single',
          title: 'Manage Room',
        },
        {
          to: '/stickers',
          icon: 'mdi-emoticon-cool',
          title: 'Stickers',
        },
      ],
    },
  ],
})
