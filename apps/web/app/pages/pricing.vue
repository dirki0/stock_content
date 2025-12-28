<script setup lang="ts">
const { t } = useI18n()

const title = computed(() => t('pages.pricing.title'))
const description = computed(() => t('pages.pricing.description'))

useSeoMeta({
  description,
  title,
})

defineOgImageComponent('OgImageTemplate')

definePageMeta({
  auth: false,
})
</script>

<template>
  <AppPageContainer
    :title="title"
    :description="description "
  >
    <PricingPlans />
  </AppPageContainer>
</template>
