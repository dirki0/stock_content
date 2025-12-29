<script setup lang="ts">
const { t } = useI18n()

const title = computed(() => t('pages.waitlistConfirmed.title'))
const description = computed(() => t('pages.waitlistConfirmed.description'))

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
    <template #headline>
      <UIcon
        name="i-lucide-check"
        class="w-8 h-8"
      />
    </template>
  </AppPageContainer>
</template>
