// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    'layer-auth',
    'layer-payment',
    'layer-storage',
    'layer-testimonials',
  ],
  runtimeConfig: {
    public: {
      adminDemoModeEnabled: process.env.NUXT_PUBLIC_ADMIN_DEMO_MODE_ENABLED === 'true',
    },
  },
})
