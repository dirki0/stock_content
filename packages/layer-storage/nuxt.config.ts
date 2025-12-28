// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  extends: ['layer-core'],

  runtimeConfig: {
    private: {
      storage: {
        local: {
          publicPath: '',
          uploadDir: ''
        },
        provider: '',
        r2: {
          accessKeyId: '',
          accountId: '',
          bucketName: '',
          publicUrl: '',
          secretAccessKey: '',
        },
        s3: {
          accessKeyId: '',
          bucketName: '',
          endpoint: '',
          publicUrl: '',
          region: '',
          secretAccessKey: '',
        }
      }
    },
  },
})
