import {
    addComponentsDir,
    addImportsDir,
    createResolver,
    defineNuxtModule,
  } from 'nuxt/kit'
  
  export default defineNuxtModule({
    meta: {
      name: 'evaluation',
    },
    setup() {
      const { resolve } = createResolver(import.meta.url)
  
      addImportsDir(resolve('./composables'))
      addComponentsDir({
        path: resolve('./components'),
      })
    },
  })
  