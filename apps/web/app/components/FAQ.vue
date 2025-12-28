<script setup lang="ts">
const { t } = useI18n()

const items = computed(() => ([
  {
    content: t('components.faq.returnPolicy.answer'),
    icon: 'i-lucide-box',
    label: t('components.faq.returnPolicy.question'),
  },
  {
    content: t('components.faq.support.answer'),
    icon: 'i-lucide-shield-question',
    label: t('components.faq.support.question'),
  },
  {
    content: t('components.faq.paymentMethods.answer'),
    icon: 'i-lucide-dollar-sign',
    label: t('components.faq.paymentMethods.question'),
  },
  {
    content: t('components.faq.discount.answer'),
    icon: 'i-lucide-circle-dollar-sign',
    label: t('components.faq.discount.question'),
  },
]))
</script>

<template>
  <UAccordion
    :items="items"
    type="multiple"
    :unmount-on-hide="false"
    :ui="{ trigger: 'text-base', body: 'text-base text-muted' }"
  />
</template>
