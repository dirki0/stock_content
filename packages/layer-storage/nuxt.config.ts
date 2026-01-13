// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['layer-auth'],

  runtimeConfig: {
    private: {
      storage: {
        allowedMimeTypes: '',
        local: {
          publicPath: '',
        },
        maxFileSize: '',
        provider: '',
        s3: {
          accessKeyId: '',
          bucketName: '',
          endpoint: '',
          publicUrl: '',
          region: '',
          secretAccessKey: '',
        },
        uploadDir: '',
        uploadRateLimit: {
          maxUploadsPerWindow: 100,
          windowSizeMinutes: 1,
        },
      },
    },
  },
})
