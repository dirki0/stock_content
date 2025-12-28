// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  extends: [
    'layer-dashboard',
    'layer-testimonials',
    'layer-blog',
    'layer-payment',
  ],

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      routes: [],
    },
  },
})
