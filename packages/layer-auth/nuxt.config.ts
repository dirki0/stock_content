// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['layer-core', 'layer-emails'],

  runtimeConfig: {
    betterAuthSecret: 'qqIZ9RpG7Cyy7GMKTWHUSkgMrkMsX5MN',
    betterAuthUrl: 'http://localhost:7000',
    private: {
      databaseUrl: 'postgresql://postgres:postgres@localhost:5432/stock',
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
      baseUrl: 'https://stock.dev.chidi.art',
    },
  },
})
