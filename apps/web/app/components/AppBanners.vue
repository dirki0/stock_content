<script lang="ts" setup>
import type { BannerProps } from '@nuxt/ui'

const { t } = useI18n()

const { data: bannerData } = useFetch('/api/banner', { server: false })
// const { isImpersonating, resetImpersonation } = useAdminImpersonation() // FIXME:
//
// const impersonationActions = ref<Array<ButtonProps>>([
//   {
//     icon: 'i-lucide-triangle-alert',
//     label: t('general.banner.impersonation.stopActionLabel'),
//     onClick: async () => {
//       await resetImpersonation()
//     },
//     size: 'sm',
//     variant: 'soft',
//   },
// ])
</script>

<template>
  <ClientOnly v-if="bannerData?.bannerProps">
    <UBanner
      id="app"
      v-bind="bannerData.bannerProps as BannerProps"
    />
  </ClientOnly>
<!--  <ClientOnly v-if="isImpersonating"> -->
<!--    <UBanner -->
<!--      id="impersonation" -->
<!--      color="warning" -->
<!--      icon="i-lucide-info" -->
<!--      :title="t('general.banner.impersonation.title')" -->
<!--      :actions="impersonationActions" -->
<!--    /> -->
<!--  </ClientOnly> -->
</template>
