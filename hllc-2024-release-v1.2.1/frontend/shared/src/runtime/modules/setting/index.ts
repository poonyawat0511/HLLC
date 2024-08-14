import { readFileSync } from 'node:fs'
import {
  addImportsDir,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
} from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'setting',
  },
  setup(_options, _nuxt) {
    // Create path resolver to get module import
    const { resolve } = createResolver(import.meta.url)

    addTypeTemplate({
      filename: './types/setting.d.ts',
      getContents: () =>
        readFileSync(resolve('./types/setting.d.ts'), { encoding: 'utf8' }),
    })

    // Use auto imports, disabled this line to make clint import by themselves
    addImportsDir(resolve('./composables'))
  },
})
