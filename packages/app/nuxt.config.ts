// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    'layer-core',
  ],
  devtools: { enabled: true },

    devServer: {
        port: 9009,
    },
})
