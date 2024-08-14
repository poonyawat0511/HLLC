export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: false },

  auth: {
    provider: {
      type: 'refresh',
    },
  },
})
