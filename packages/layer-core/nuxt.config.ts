// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',

  devtools: { enabled: true },

  eslint: {
    config: {
      standalone: false,
    },
  },

  extends: ['layer-emails'],

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
    '@vueuse/nuxt',
  ],

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },

  runtimeConfig: {
    betterAuthSecret: '',
    betterAuthUrl: '',
    private: {
      databaseUrl: '',
      githubClientId: '',
      githubClientSecret: '',
      googleClientId: '',
      googleClientSecret: '',
    },
    public: {
      auth: {
        redirectGuestTo: '/login',
        redirectUserTo: '/',
      },
      baseUrl: '',
    },
  },
})
