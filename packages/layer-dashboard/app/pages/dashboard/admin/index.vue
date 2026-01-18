<script setup>
const { t } = useI18n()
const { public: { adminDemoModeEnabled } } = useRuntimeConfig()
const { isUserAdmin } = useAuth()

definePageMeta({
  layout: 'dashboard',
  middleware: 'admin',
})

useSeoMeta({
  title: t('pages.admin.title'),
})
</script>

<template>
  <UDashboardPanel id="admin">
    <template #header>
      <UDashboardNavbar
        :title="t('pages.admin.title')"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UBanner
        v-if="adminDemoModeEnabled && isUserAdmin"
        icon="i-lucide-message-square-warning"
        color="warning"
        title="Admin Demo Mode: Sensitive data is masked and all non-GET API requests are blocked"
      />

      <NuxtPage />
    </template>
  </UDashboardPanel>
</template>
