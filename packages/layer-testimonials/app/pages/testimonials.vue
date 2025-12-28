<script setup lang="ts">
const { t } = useI18n()

const { data: testimonials } = useFetch<Array<Testimonial>>('/api/testimonials', { server: false })

const title = computed(() => t('pages.testimonials.title'))
const description = computed(() => t('pages.testimonials.description'))

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
    <ClientOnly>
      <Testimonials :testimonials="testimonials ?? []" />
      <template #fallback>
        <TestimonialsSkeletons />
      </template>
    </ClientOnly>
  </AppPageContainer>
</template>
