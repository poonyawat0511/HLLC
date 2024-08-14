import {
    addComponentsDir,
    addImportsDir,
    createResolver,
    defineNuxtModule,
  } from 'nuxt/kit'
  
  export default defineNuxtModule({
    meta: {
      name: 'question',
    },
    setup() {
      const { resolve } = createResolver(import.meta.url)
  
      addImportsDir(resolve('./composables'))
      addImportsDir(resolve('./utils'))
  
      addComponentsDir({
        path: resolve('./components'),
      })
    },
  })
  