// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',

  devtools: { enabled: true },

  eslint: {
    config: {
      standalone: false,
    },
  },

  hub: {
    blob: true,
    database: true,
    kv: true,
    workers: true,
  },

  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [{
      code: 'de',
      file: 'de.json',
      name: 'Deutsch',
    }, {
      code: 'en',
      file: 'en.json',
      name: 'English',
    }],
    strategy: 'no_prefix',
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxthub/core',
  ],

  nitro: {
    preset: 'cloudflare-worker',
  },
})
