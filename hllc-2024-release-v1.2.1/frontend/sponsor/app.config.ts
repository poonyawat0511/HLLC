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
          to: '/reports/dashboard',
          icon: 'mdi-chart-box-multiple',
          title: 'Report Dashboard',
        },
        {
          to: '/reports',
          icon: 'mdi-alert-octagon',
          title: 'User Reports',
        },
        {
          to: '/reports/category',
          icon: 'mdi-format-list-group',
          title: 'Report Categories',
        },
        {
          to: '/notifications',
          icon: 'mdi-bell-ring',
          title: 'Notifications',
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
          to: '/assessments',
          icon: 'mdi-file-document-edit',
          title: 'Pre & Post Assessments',
        },
        {
          to: '/contests',
          icon: 'mdi-theater',
          title: 'Fresher Contest Vidoes',
        },
        {
          to: '/contests/summary',
          icon: 'mdi-chart-line',
          title: 'Fresher Contests Summary',
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
          to: '/schools',
          icon: 'mdi-school',
          title: 'Schools',
        },
        {
          to: '/themes',
          icon: 'mdi-palette',
          title: 'Schools Theme',
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
          to: '/admins',
          icon: 'mdi-shield-account',
          title: 'Admins',
        },
      ],
    },
    {
      module: 'Sponsors',
      children: [
        {
          to: '/sponsors',
          icon: 'mdi-cash-multiple',
          title: 'System sponsor',
        },
        {
          to: '/sponsors/vouchers',
          icon: 'mdi-ticket-percent',
          title: 'Voucher Tickets',
        },
        {
          to: '/sponsors/voucher-codes',
          icon: 'mdi-ticket-account',
          title: 'Voucher Codes',
        },
      ],
    },
  ],
})
