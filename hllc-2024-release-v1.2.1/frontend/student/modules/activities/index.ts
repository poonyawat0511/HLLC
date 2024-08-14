import {
  addComponentsDir,
  addImportsDir,
  createResolver,
  defineNuxtModule,
  addPlugin,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'activity',
  },
  setup() {
    // Create path resolver to get module import
    const { resolve } = createResolver(import.meta.url)

    // Use auto imports, disabled this line to make clint import by themselves
    addImportsDir(resolve('./composables'))
    addComponentsDir({
      path: resolve('./components'),
    })

    addPlugin({
      src: resolve('./plugin.ts'),
    })
  },
})
