import { addImportsDir, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'filterable',
  },
  setup() {
    // Create path resolver to get module import
    const { resolve } = createResolver(import.meta.url)
    // Use auto imports, disabled this line to make clint import by themselves
    addImportsDir(resolve('./composables'))
  },
})
