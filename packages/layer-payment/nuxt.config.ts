// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['layer-auth'],

  runtimeConfig: {
    private: {
      polarAccessToken: '',
      polarOrganizationId: '',
      polarServer: '',
    },
  },
})
