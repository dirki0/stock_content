<script setup lang="ts">
import { sub } from 'date-fns'

import type { Period, Range } from '../../types/home.types'

const { t } = useI18n()

const range = shallowRef<Range>({
  end: new Date(),
  start: sub(new Date(), { days: 14 }),
})
const period = ref<Period>('daily')

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  description: t('pages.dashboard.description'),
  title: t('pages.dashboard.title'),
})
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :title="t('pages.dashboard.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <HomeStats
        :period="period"
        :range="range"
      />
      <HomeChart
        :period="period"
        :range="range"
      />
    </template>
  </UDashboardPanel>
</template>
