// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    private: {
      blobProvider: 'local',
      blobUploadDirectory: 'uploads',
      blobPublicPath: '/uploads',
    }
  }
})
