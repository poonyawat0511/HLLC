import type { VBtn } from 'vuetify/components'

declare module 'nuxt/schema' {
  interface AppConfigInput {
    menus: NavigationList
    expansions: NavigationExpansionList
    icons: {
      warning: string
      success: string
      error: string
    }
    button?: Record<string, InstanceType<typeof VBtn>['$props']>
  }
}

declare module '#app' {
  interface PageMeta {
    menu?: {
      active?: Title
      display?: boolean
      pcOnly?: boolean
    }
    force?: boolean
    background?: boolean
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    menu?: {
      active?: Title
      display?: boolean
      pcOnly?: boolean
    }
    force?: boolean
    background?: boolean
  }
}

export {}
