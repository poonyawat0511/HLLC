import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'lamduan',
  },
  setup() {
    const { resolve } = createResolver(import.meta.url)

    addImportsDir(resolve('./composables'))
    addComponentsDir({
      path: resolve('./components'),
    })
  },
})
