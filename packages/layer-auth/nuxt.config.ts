// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['layer-core', 'layer-emails'],

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
