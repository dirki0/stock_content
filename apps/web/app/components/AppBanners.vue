<script lang="ts" setup>
import type { BannerProps, ButtonProps } from '@nuxt/ui'

const { t } = useI18n()

const { data: bannerData } = useFetch('/api/banner')
const { client, isImpersonated } = useAuth()

const impersonationActions = ref<Array<ButtonProps>>([
  {
    icon: 'i-lucide-triangle-alert',
    label: t('general.banner.impersonation.stopActionLabel'),
    onClick: async () => {
      await client.admin.stopImpersonating()
    },
    size: 'sm',
    variant: 'soft',
  },
])
</script>

<template>
  <ClientOnly v-if="bannerData?.bannerProps">
    <UBanner
      id="app"
      v-bind="bannerData.bannerProps as BannerProps"
    />
  </ClientOnly>
  <ClientOnly v-if="isImpersonated">
    <UBanner
      id="impersonation"
      color="warning"
      icon="i-lucide-info"
      :title="t('general.banner.impersonation.title')"
      :actions="impersonationActions"
    />
  </ClientOnly>
</template>
