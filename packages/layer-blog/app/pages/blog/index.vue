<script setup lang="ts">
const { data: posts } = await useAsyncData('allBlogPosts', () => queryCollection('blog').order('date', 'DESC').all())

if (posts.value) {
  prerenderRoutes(posts.value.map(post => post.path))
}

const { t } = useI18n()

const title = computed(() => t('pages.blog.title'))
const description = computed(() => t('pages.blog.description'))

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
    <UBlogPosts>
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        :to="post.path"
        :title="post.title"
        :description="post.description"
        :image="post.image"
        :date="post.date"
        :badge="post.category"
        :authors="post.authors"
        :ui="{
          description: 'line-clamp-2',
        }"
      />
    </UBlogPosts>
  </AppPageContainer>
</template>
