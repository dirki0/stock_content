// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['layer-core'],
  modules: [
    'nuxt-email-renderer',
  ],
  runtimeConfig: {
    private: {
      emailPlunkApiKey: '',
      emailPlunkApiUrl: '',
      emailProvider: 'plunk',
    },
  },
})
