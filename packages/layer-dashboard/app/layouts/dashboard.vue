<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { client, isUserAdmin, user } = useAuth()
const { t } = useI18n()
const { hasProPlan } = useBilling()

const { data: customerState, error } = await client.customer.state()

const items = computed(() => {
  const _items: Array<NavigationMenuItem> = [
    {
      icon: 'i-lucide-home',
      label: t('pages.dashboard.links.home'),
      to: '/dashboard',
    },
  ]

  if (isUserAdmin.value) {
    _items.push({
      badge: {
        color: 'warning',
        label: 'Internal',
      },
      children: [{
        exact: true,
        label: t('pages.admin.links.users'),
        to: '/dashboard/admin/users',
      }, {
        exact: true,
        label: t('pages.admin.links.waitlist'),
        to: '/dashboard/admin/waitlist',
      }, {
        exact: true,
        label: t('pages.admin.links.testimonials'),
        to: '/dashboard/admin/testimonials',
      }, {
        exact: true,
        label: t('pages.admin.links.banner'),
        to: '/dashboard/admin/banner',
      }],
      icon: 'i-lucide-user-check',
      label: t('pages.dashboard.links.admin'),
      to: '/dashboard/admin/users',
    })
  }

  return _items
})
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      class="bg-(--ui-bg-elevated)/25"
      :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center justify-between w-full">
          <AppLogo
            :show-app-name="!collapsed"
            link-text-class="text-sm"
          />
          <UBadge
            v-if="!collapsed && hasProPlan"
            color="primary"
            variant="outline"
          >
            Pro
          </UBadge>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :items="items"
          :collapsed="collapsed"
          orientation="vertical"
          color="neutral"
        />

        <UNavigationMenu
          orientation="vertical"
          :collapsed="collapsed"
          :items="[{
            label: t('pages.dashboard.links.feedback'),
            icon: 'i-lucide-message-circle',
            to: 'https://github.com/nuxt-ui-pro/dashboard',
            target: '_blank',
          }, {
            label: t('pages.dashboard.links.help'),
            icon: 'i-lucide-life-buoy',
            to: 'https://github.com/nuxt/ui-pro',
            target: '_blank',
          }]"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <DashboardUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <div class="flex flex-col w-full h-full overflow-auto">
      <AppBanners />
      <slot />
      {{ customerState }}
      {{ error }}
    </div>
  </UDashboardGroup>
</template>
