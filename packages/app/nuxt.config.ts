import { defineOrganization } from 'nuxt-schema-org/schema'
import { siteConfig } from 'site-config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  css: ['~/assets/css/main.css'],

  devServer: {
    port: 9009,
  },

  extends: [
    'layer-core',
    'layer-emails',
  ],

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
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxt/image',
  ],

  ogImage: {
    enabled: true,
    zeroRuntime: true, // see https://nuxtseo.com/docs/og-image/guides/zero-runtime
  },

  robots: {
    disallow: [
      '/admin',
    ],
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
