<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js'

interface Props {
  activeSubscription: CustomerStateSubscription | null
  hasLifeTimeDeal?: boolean
  products: Array<PaymentProduct>
}
const props = defineProps<Props>()

const { t } = useI18n()
const auth = useAuth()
const { getFreePlanUiConfig, getLifeTimeDealUiConfig, getMonthlyPlanUiConfig, getYearlyPlanUiConfig } = usePaymentPlans()

const isLoading = ref(false)

const monthlySubscriptionProduct = computed(() => props.products.find(product => product.type === 'recurring' && product.recurringInterval === 'month'))
const yearlySubscriptionProduct = computed(() => props.products.find(product => product.type === 'recurring' && product.recurringInterval === 'year'))
const lifeTimeDeal = computed(() => props.products.find(plan => plan.type === 'one-time'))

const isYearlyProductSubscribed = computed(() => props.activeSubscription?.productId === yearlySubscriptionProduct.value?.id)
const isMonthlyProductSubscribed = computed(() => props.activeSubscription?.productId === monthlySubscriptionProduct.value?.id)
const hasProPlan = computed(() => isYearlyProductSubscribed.value || isMonthlyProductSubscribed.value || props.hasLifeTimeDeal)

const activeBillingCycle = ref(isYearlyProductSubscribed.value ? '1' : '0')
const billingCycleTabItems = computed(() => [
  { label: 'Monthly' },
  { label: 'Yearly' },
])

const plans = computed(() => {
  const baseButtonProps: ButtonProps = {
    loading: isLoading.value,
    size: 'lg',
  }

  const _plans = props.hasLifeTimeDeal
    ? []
    : [
        getFreePlanUiConfig(0, 5, {
          ...baseButtonProps,
          color: 'neutral',
          disabled: true,
          icon: 'i-lucide-check',
          label: t('pages.pricing.onThisPlan'),
          variant: 'soft',
          ...(hasProPlan.value && {
            color: 'neutral',
            disabled: false,
            icon: undefined,
            label: t('pages.pricing.downgrade'),
            onClick: async () => {
              await auth.client.customer.portal()
            },
          }),
        }),
      ]

  if (lifeTimeDeal.value) {
    const price = lifeTimeDeal.value.price / 100
    const featureCount = 5
    const buttonConfig: ButtonProps = {
      ...baseButtonProps,
      onClick: async () => await auth.client.checkout({
        products: [lifeTimeDeal.value!.id],
      }),
      ...(props.hasLifeTimeDeal && { disabled: true, icon: 'i-lucide-check', label: t('pages.pricing.onThisPlan') }),
    }
    const config = getLifeTimeDealUiConfig(price, featureCount, buttonConfig, !hasProPlan.value)
    _plans.push(config)
  }

  if (monthlySubscriptionProduct.value && activeBillingCycle.value === '0' && !props.hasLifeTimeDeal) {
    const price = monthlySubscriptionProduct.value.price / 100
    const featureCount = 5
    const buttonConfig: ButtonProps = {
      ...baseButtonProps,
      label: t('pages.pricing.switchPlan'),
      onClick: async () => await auth.client.checkout({
        products: [monthlySubscriptionProduct.value!.id],
      }),
      variant: 'soft',
      ...(isMonthlyProductSubscribed.value && { disabled: true, icon: 'i-lucide-check', label: t('pages.pricing.onThisPlan') }),
    }
    const config = getMonthlyPlanUiConfig(price, featureCount, buttonConfig)
    _plans.push(config)
  }

  if (yearlySubscriptionProduct.value && activeBillingCycle.value === '1' && !props.hasLifeTimeDeal) {
    const price = yearlySubscriptionProduct.value.price / 100
    const featureCount = 5
    const buttonConfig: ButtonProps = {
      ...baseButtonProps,
      label: t('pages.pricing.switchPlan'),
      onClick: async () => await auth.client.checkout({
        products: [yearlySubscriptionProduct.value!.id],
      }),
      variant: 'soft',
      ...(isYearlyProductSubscribed.value && { disabled: true, icon: 'i-lucide-check', label: t('pages.pricing.onThisPlan') }),
    }
    const config = getYearlyPlanUiConfig(price, featureCount, buttonConfig)
    _plans.push(config)
  }

  return _plans
})
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div
      v-if="!hasLifeTimeDeal"
      class="flex justify-center w-full mb-12"
    >
      <UTabs
        v-model="activeBillingCycle"
        :items="billingCycleTabItems"
        color="neutral"
        class="w-72"
        :ui="{ list: 'rounded-full', indicator: 'rounded-full' }"
      />
    </div>
    <UPricingPlans>
      <UPricingPlan
        v-for="(plan, index) in plans"
        :key="index"
        v-bind="plan"
      />
    </UPricingPlans>
  </div>
</template>
