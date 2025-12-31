<script setup lang="ts">
const { t } = useI18n()
const auth = useAuth()
const { hasLifetimeDeal, products } = useBilling()

const title = computed(() => t('pages.dashboard.settings.links.billing'))
const hasActiveSubscription = computed(() => auth.activeSubscription.value !== null)
const activeSubscription = computed(() => auth.activeSubscription.value)

useSeoMeta({
  title,
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <BillingOverview
      v-if="hasActiveSubscription"
      :subscription="activeSubscription"
      :has-life-time-deal="hasLifetimeDeal"
    />
    <BillingPlanSelector
      :products="products"
      :active-subscription="activeSubscription"
      :has-life-time-deal="hasLifetimeDeal"
    />
  </div>
</template>
