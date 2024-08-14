// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: true,

  app: {
    head: {
      title: 'HLLC 2024',
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
      socketURL: process.env.SOCKET_URL || 'http://localhost:8080/',
    },
    authSecret: process.env.AUTH_SECRET || 'not secured secret',
  },

  plugins: [
    '~/plugins/qrcode.ts',
    '~/plugins/rules.ts',
    '~/plugins/assessment.ts',
  ],

  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxtjs/i18n', '@hllc/shared'],

  css: ['~/assets/styles/main.css'],

  fonts: {
    families: [
      { name: 'Noto Sans Thai', provider: 'google' },
      { name: 'Museo Sans', provider: 'google' },
    ],
  },

  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.lang.ts' },
      { code: 'th', name: 'ภาษาไทย', iso: 'th-TH', file: 'th.lang.ts' },
    ],
    defaultLocale: 'th',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    lazy: true,
    langDir: 'assets/lang/',
  },

  auth: {
    isEnabled: true,
    baseURL: `${process.env.BASE_URL || 'http://localhost:8080/api'}/auth`,
    globalAppMiddleware: true,
    provider: {
      refreshOnlyToken: false,
      type: 'refresh',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/profile', method: 'get' },
        refresh: { path: '/refresh', method: 'post' },
      },
      token: {
        signInResponseTokenPointer: '/data/accessToken',
        type: 'Bearer',
        maxAgeInSeconds: 60 * 60 * 24 * 7, // 7 days
        sameSiteAttribute: 'lax',
      },
      refreshToken: {
        signInResponseRefreshTokenPointer: '/data/refreshToken',
        maxAgeInSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },
})
