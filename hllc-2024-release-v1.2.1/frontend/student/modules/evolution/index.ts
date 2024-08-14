import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'evolution',
  },
  setup() {
    // Create path resolver to get module import
    const { resolve } = createResolver(import.meta.url)

    // Add auto import components
    addComponentsDir({
      path: resolve('./components'),
    })

    // Use auto imports, disabled this line to make clint import by themselves
    addImportsDir(resolve('./composables'))
  },
})
