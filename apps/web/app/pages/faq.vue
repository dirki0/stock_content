<script setup lang="ts">
const { t } = useI18n()

const title = computed(() => t('pages.faq.title'))
const description = computed(() => t('pages.faq.description'))

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
    :description="description"
  >
    <FAQ />
  </AppPageContainer>
</template>
