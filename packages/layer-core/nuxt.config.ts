// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  eslint: {
    config: {
      standalone: false,
    },
  },

  modules: ['@nuxt/eslint'],
})
