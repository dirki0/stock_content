// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    css: ['~/assets/css/main.css'],

  extends: [
    'layer-core',
  ],

  modules: ['@nuxt/ui'],

  devtools: { enabled: true },

  devServer: {
    port: 9009,
  },
})
