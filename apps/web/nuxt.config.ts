import { defineOrganization } from 'nuxt-schema-org/schema'
import { siteConfig } from 'site-config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  devServer: {
    port: 9009,
  },

  extends: ['layer-emails'],

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

  modules: ['@nuxt/content', '@nuxtjs/seo', '@nuxt/image'],

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      routes: [],
    },
  },

  ogImage: {
    enabled: true,
    zeroRuntime: true, // see https://nuxtseo.com/docs/og-image/guides/zero-runtime
  },

  robots: {
    disallow: ['/admin'],
  },

  runtimeConfig: {
    private: {
      databaseUrl: process.env.NUXT_PRIVATE_DATABASE_URL,
    },
    public: {
      auth: {
        redirectGuestTo: '/login',
        redirectUserTo: '/',
      },
      baseURL: process.env.NUXT_APP_URL,
    },
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
