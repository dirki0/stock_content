<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { t } = useI18n()
const { loggedIn } = useAuth()

const { data: allProductsData } = useFetch('/api/payment/products')
const { getFreePlanUiConfig, getLifeTimeDealUiConfig, getMonthlyPlanUiConfig, getYearlyPlanUiConfig } = usePaymentPlans()

const activeBillingCycle = ref('0')
const billingCycleTabItems = [{ label: t('pages.pricing.billingCycle.monthly') }, { label: t('pages.pricing.billingCycle.yearly') }]

async function onButtonClick () {
  if (loggedIn.value) {
    await navigateTo('/dashboard/settings/billing')
  }
  else {
    await navigateTo('/auth/login')
  }
}

const plans = computed(() => {
  const monthlyPlan = allProductsData.value?.find(plan => plan.recurringInterval === 'month')
  const yearlyPlan = allProductsData.value?.find(plan => plan.recurringInterval === 'year')
  const lifeTimeDeal = allProductsData.value?.find(plan => plan.type === 'one-time')

  const baseButtonProps: ButtonProps = {
    block: false,
    label: t('pages.pricing.getStarted'),
    onClick: onButtonClick,
    size: 'lg',
    trailingIcon: 'i-lucide-arrow-right',
  }

  const _plans = [getFreePlanUiConfig(0, 5, { ...baseButtonProps, variant: 'soft' })]

  if (lifeTimeDeal) {
    _plans.push(getLifeTimeDealUiConfig(lifeTimeDeal.price / 100, 5, baseButtonProps, true))
  }

  if (monthlyPlan && activeBillingCycle.value === '0') {
    _plans.push(getMonthlyPlanUiConfig(monthlyPlan.price / 100, 5, { ...baseButtonProps, variant: 'soft' }))
  }

  if (yearlyPlan && activeBillingCycle.value === '1') {
    _plans.push(getYearlyPlanUiConfig(yearlyPlan.price / 100, 5, { ...baseButtonProps, variant: 'soft' }))
  }

  return _plans
})
</script>

<template>
  <div class="flex justify-center w-full">
    <UTabs
        v-model="activeBillingCycle"
        :items="billingCycleTabItems"
        color="neutral"
        class="w-72"
        :ui="{ list: 'rounded-full', indicator: 'rounded-full' }"
    />
  </div>
  <UPricingPlans compact>
    <UPricingPlan
        v-for="(plan, index) of plans"
        :key="index"
        v-bind="plan"
    />
  </UPricingPlans>
</template>
