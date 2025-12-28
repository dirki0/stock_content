// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  eslint: {
    config: {
      standalone: false,
    },
  },

  modules: [
    '@nuxt/eslint',
  ],
})
