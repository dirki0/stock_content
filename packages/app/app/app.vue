<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui'
import * as locales from '@nuxt/ui/locale'

const appConfig = useAppConfig()
const { locale, t } = useI18n()

const searchTerm = ref('')

const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

const { data: navigationDocs } = await useAsyncData('docsNavigation', () => queryCollectionNavigation('docs'), {
  transform: data => data.find(item => item.path === '/docs')?.children || [],
})
const { data: contentNavigation } = await useAsyncData('contentNavigation', () => queryCollectionNavigation('content'))

const { data: contentFiles } = useLazyAsyncData('contentSearch', () => queryCollectionSearchSections('content'), {
  server: false,
})

provide('navigationDocs', navigationDocs)

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  const toast = useToast()
  const appConfig = useAppConfig()

  appConfig.toaster.position = 'bottom-right'

  toast.add({
    actions: [{
      color: 'neutral',
      label: t('general.cookieConsent.buttonAccept'),
      onClick: () => {
        cookie.value = 'accepted'
        appConfig.toaster.position = 'top-right'
      },
      variant: 'outline',
    }, {
      color: 'neutral',
      label: t('general.cookieConsent.buttonOptOut'),
      onClick: () => {
        appConfig.toaster.position = 'top-right'
      },
      variant: 'ghost',
    }],
    close: false,
    duration: 0,
    title: t('general.cookieConsent.title'),
  })
})

const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  htmlAttrs: {
    dir,
    lang,
  },
  link: [
    { href: '/favicon.ico', rel: 'icon' },
  ],
  meta: [
    { charset: 'utf-8' },
    { content: 'width=device-width, initial-scale=1', name: 'viewport' },
    { content: color, key: 'theme-color', name: 'theme-color' },
  ],
})

useSeoMeta({
  description: t('general.description'),
  title: t('general.name'),
})
</script>

<template>
  <UApp
    :locale="locales[locale]"
    :toaster="appConfig.toaster as ToasterProps"
  >
    <NuxtLoadingIndicator color="#FC8907" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm"
        :files="contentFiles"
        :navigation="contentNavigation"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
