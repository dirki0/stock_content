// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  extends: ['layer-dashboard', 'layer-testimonials'],

  modules: ['@nuxt/content'],

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      routes: [],
    },
  },
})
