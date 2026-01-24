import './validate-env'

const REDIRECT_INTRUDERS_GIF = 'https://i.imgur.com/1Ia9tTG.gif'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],

  extends: [
    'layer-dashboard',
    'layer-testimonials',
    'layer-blog',
    'layer-waitlist',
    'layer-docs',
  ],

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      routes: [],
    },
  },

  routeRules: {
    /* eslint-disable perfectionist/sort-objects */
    '/': { prerender: true },
    '/blog': { prerender: true }, // individual blog posts are pre-rendered inside /blog component
    '/changelog': { prerender: true },
    '/contact': { prerender: true },
    '/dashboard/**': { ssr: false },
    '/docs': { prerender: true }, // individual docs pages are pre-rendered inside /docs component
    '/faq': { prerender: true },
    '/legal/**': { prerender: true },
    '/pricing': { prerender: true },
    '/testimonials': { prerender: true },
    '/api/**': { cors: true },
    // Redirect intruder
    '/.env': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/.info.php': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/.phpinfo.php': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/wp-admin': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/wp-admin/**': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/wp-includes/**': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/wp-login': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    '/wp-login.php ': { redirect: { statusCode: 302, to: REDIRECT_INTRUDERS_GIF } },
    /* eslint-enable perfectionist/sort-objects */
  },
})
