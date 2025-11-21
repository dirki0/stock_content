// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  css: ['~/assets/css/main.css'],

  devServer: {
    port: 9009,
  },

  devtools: { enabled: true },

  extends: [
    'layer-core',
  ],

  modules: ['@nuxt/ui'],
})
