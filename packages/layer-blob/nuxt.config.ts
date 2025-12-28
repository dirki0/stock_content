// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['layer-core'],
  runtimeConfig: {
    private: {
      blobProvider: 'local',
      blobUploadDirectory: 'uploads',
      blobPublicPath: '/uploads',
    }
  }
})
