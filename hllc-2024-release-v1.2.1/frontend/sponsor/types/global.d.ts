declare module 'nuxt/schema' {
  interface AppConfigInput {
    menus: MenuItem[]
  }
}

declare module '#app' {
  interface PageMeta {
    breadcrumbs?: BreadcrumbItem[]
  }
}
declare module 'vue-router' {
  interface RouteMeta {
    breadcrumbs?: BreadcrumbItem[]
  }
}

export {}
