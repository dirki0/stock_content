<script setup lang="ts">
const { t } = useI18n()

const title = computed(() => t('pages.contact.title'))
const description = computed(() => t('pages.contact.description'))

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
    :description="title"
  >
    <ContactForm />
  </AppPageContainer>
</template>
