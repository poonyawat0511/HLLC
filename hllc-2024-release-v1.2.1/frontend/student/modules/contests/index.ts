import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'contest',
  },
  setup() {
    // Create path resolver to get module import
    const { resolve } = createResolver(import.meta.url)

    // Use auto imports, disabled this line to make clint import by themselves
    addImportsDir(resolve('./composables'))
    addImportsDir(resolve('./utils'))

    // Add auto import components
    addComponentsDir({
      path: resolve('./components'),
    })
  },
})
