<script setup lang="ts">
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js'

interface Props {
  subscription: CustomerStateSubscription
}
const props = defineProps<Props>()

const auth = useAuth()

const formattedPrice = computed(() => {
  const formatter = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  })
  return formatter.format(props.subscription.amount / 100)
})

async function openCustomerPortal () {
  await auth.client.customer.portal()
}
</script>

<template>
  <UPageCard
    icon="i-lucide-circle-user-round"
    variant="soft"
    :title="$t('pages.pricing.billingOverview.title')"
    :description="$t('pages.pricing.billingOverview.description')"
    @click="openCustomerPortal"
  >
    <span class="font-bold">
      {{ formattedPrice }}/{{ subscription.recurringInterval }}
    </span>
  </UPageCard>
</template>
