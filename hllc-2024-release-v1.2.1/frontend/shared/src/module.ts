import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  installModule,
  addImportsDir,
  addComponentsDir,
  addTemplate,
  addImports,
} from '@nuxt/kit'
import { readFileSync } from 'node:fs'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@hllc/shared',
    configKey: 'hllc',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, nuxt) {
    // Create path resolver to get module import
    const { resolve } = createResolver(import.meta.url)

    // Install sidebase auth to handle authentication and use in api plugin
    await installModule('@sidebase/nuxt-auth', {
      provider: { type: 'refresh' },
    })

    // Install base stylistic provider and use with school colors
    await installModule('vuetify-nuxt-module')

    // Add neccessary plugins
    addPlugin(resolve('./runtime/plugins/api'))

    // Transpile module dependencies
    nuxt.options.build.transpile.push('object-to-formdata')

    // Use auto imports, disabled this line to make clint import by themselves
    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/utils'))

    // Add auto import components
    addComponentsDir({
      path: resolve('./runtime/components'),
    })

    addTemplate({
      filename: './types/response.d.ts',
      getContents: () =>
        readFileSync(resolve('./runtime/types/response.d.ts'), {
          encoding: 'utf8',
        }),
    })

    await installModule(resolve('./runtime/modules/setting'))

    nuxt.hook('nitro:config', (config) => {
      config.routeRules = config.routeRules || {}
      config.routeRules['/with-caching'] = {
        ...(config.routeRules['/with-caching'] || {}),
        auth: { disableServerSideAuth: true },
      }
    })
  },
})
