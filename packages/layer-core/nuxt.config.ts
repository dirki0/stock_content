import { defineOrganization } from 'nuxt-schema-org/schema'
import { siteConfig } from 'site-config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-24',

  devServer: {
    port: 9009,
  },

  devtools: { enabled: true },

  eslint: {
    config: {
      standalone: false,
    },
  },

  i18n: {
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [{
      code: 'de',
      file: 'de.json',
      name: 'Deutsch',
    }, {
      code: 'en',
      file: 'en.json',
      name: 'English',
    }],
    strategy: 'no_prefix',
  },

  image: {
    domains: ['demo.nuxtstarterkit.com'],
    provider: 'twicpics',
    twicpics: {
      baseURL: siteConfig.imageProviderUrl,
    },
  },

  llms: {
    description: siteConfig.description,
    domain: siteConfig.domain,
    title: siteConfig.name,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-llms',
    'nuxt-security',
    'nuxt-umami',
  ],

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },

  ogImage: {
    enabled: true,
  },

  robots: {
    disallow: ['/admin'],
  },

  runtimeConfig: {
    private: {
      redisUrl: '',
    },
  },

  schemaOrg: {
    identity: defineOrganization({
      logo: siteConfig.logoUrl,
      name: siteConfig.name,
    }),
  },

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          '\'self\'',
          'data:',
          'https://avatars.githubusercontent.com',
          'https://lh3.googleusercontent.com',
          siteConfig.url,
          siteConfig.imageProviderUrl,
        ],
        'script-src': [
          '\'self\'',
          '\'unsafe-inline\'',
          '\'unsafe-eval\'',
          '\'nonce-{{nonce}}\'', // Add nonce support
        ],
        'script-src-attr': [
          '\'unsafe-inline\'',
        ],
      },
      crossOriginEmbedderPolicy: false,
    },
    nonce: true, // Enable automatic nonce generation
  },

  site: {
    defaultLocale: 'en-US',
    description: siteConfig.description,
    name: siteConfig.name,
    url: siteConfig.url,
  },

  sitemap: { exclude: ['/admin/**'] },

  umami: {
    domains: [siteConfig.domain],
    ignoreLocalhost: true,
    proxy: 'cloak',
  },
})
