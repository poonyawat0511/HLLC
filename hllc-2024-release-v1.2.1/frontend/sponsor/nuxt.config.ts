// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    rootId: '__hllc',
    head: {
      title: 'Sponsor - HLLC',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/png', href: 'logo-sdad.png' },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          href: 'logo-sdad.png',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:8080/api',
    },
  },

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@hllc/shared'],

  vuetify: {
    vuetifyOptions: './vuetify.config.ts',
  },

  css: ['~/assets/styles/main.css'],

  auth: {
    isEnabled: true,
    baseURL: `${
      process.env.BASE_URL || 'http://localhost:8080/api'
    }/auth/admin`,
    globalAppMiddleware: true,
    provider: {
      refreshOnlyToken: false,
      type: 'refresh',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        getSession: { path: '/profile', method: 'get' },
        refresh: { path: '/refresh', method: 'post' },
        signOut: false,
      },
      token: {
        signInResponseTokenPointer: '/data/accessToken',
        type: 'Bearer',
        maxAgeInSeconds: 60 * 30, // 30 minutes
        sameSiteAttribute: 'lax',
        cookieName: 'auth.sponsor.token',
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/data/refreshToken',
        maxAgeInSeconds: 60 * 60 * 24 * 7, // 7 days
        cookieName: 'auth.sponsor.refresh',
      },
    },
  },
})
