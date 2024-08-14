declare module 'nitropack' {
  interface NitroRouteConfig {
    auth: {
      disableServerSideAuth?: boolean
    }
  }
}

declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    baseURL: string
  }
}

export {}
