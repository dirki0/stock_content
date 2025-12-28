import { defineOrganization } from 'nuxt-schema-org/schema'
import { siteConfig } from 'site-config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-10-01',

  css: ['~/assets/css/main.css'],

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
    provider: 'ipx',
    // FIXME:
    // providers: {
    //   customCloudflare: {
    //     options: {
    //       prodSiteURL: siteConfig.url,
    //     },
    //     provider: '~/providers/customCloudflare.ts',
    //   },
    // },
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
  ],

  nitro: {
    experimental: {
      asyncContext: true,
    },
  },

  ogImage: {
    enabled: true,
    zeroRuntime: true, // see https://nuxtseo.com/docs/og-image/guides/zero-runtime
  },

  robots: {
    disallow: ['/admin'],
  },

  schemaOrg: {
    identity: defineOrganization({
      logo: siteConfig.logoUrl,
      name: siteConfig.name,
    }),
  },

  site: {
    defaultLocale: 'en-US',
    description: siteConfig.description,
    name: siteConfig.name,
    url: siteConfig.url,
  },

  sitemap: { exclude: ['/admin/**'] },
})
