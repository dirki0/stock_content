<script setup lang="ts">
const { t } = useI18n()

const route = useRoute()
const title = computed(() => {
  const isBillingPath = route.path.startsWith('/dashboard/settings/billing')
  const isSecurityPath = route.path.startsWith('/dashboard/settings/security')
  const isProfilePath = route.path === '/dashboard/settings'

  if (isBillingPath) {
    return 'Manage your billing settings'
  }
  if (isSecurityPath) {
    return 'Manage your security settings'
  }
  if (isProfilePath) {
    return 'Manage your profile'
  }

  return t('pages.dashboard.settings.title')
})

const links = [[{
  exact: true,
  icon: 'i-lucide-user',
  label: t('pages.dashboard.settings.links.profile'),
  to: '/dashboard/settings',
}, {
  icon: 'i-lucide-circle-dollar-sign',
  label: t('pages.dashboard.settings.links.billing'),
  to: '/dashboard/settings/billing',
}, {
  icon: 'i-lucide-shield',
  label: t('pages.dashboard.settings.links.security'),
  to: '/dashboard/settings/security',
}], []]

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title,
})
</script>

<template>
  <UDashboardPanel
    id="settings"
    :ui="{ body: 'lg:py-12' }"
  >
    <template #header>
      <UDashboardNavbar
        :title="title"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
        <UNavigationMenu
          :items="links"
          highlight
          class="-mx-1 flex-1"
        />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div
        class="flex flex-col gap-4 sm:gap-6 lg:gap-12 mx-auto"
        :class="{ 'lg:max-w-2xl': $route.path !== '/dashboard/settings/billing' }"
      >
        <NuxtPage />
      </div>
    </template>
  </UDashboardPanel>
</template>
