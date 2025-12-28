<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => queryCollection('blog').path(route.path).first())
if (!post.value) {
  throw createError({ fatal: true, statusCode: 404, statusMessage: 'Page not found' })
}

const { data: surround } = await useAsyncData(`${route.path}-blog-surround`, () => {
  return queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description'],
  })
})

function formatDate (dateString: string) {
  return useDateFormat(new Date(dateString), 'MMMM DD, YYYY').value
}

useSeoMeta({
  description: post.value.description,
  ogDescription: post.value.description,
  ogImage: post.value.image,
  ogTitle: post.value.title,
  title: post.value.title,
  titleTemplate: '%s',
  twitterDescription: post.value.description,
  twitterImage: post.value.image,
  twitterTitle: post.value.title,
})

defineOgImageComponent('OgImageTemplate')

definePageMeta({
  auth: false,
})
</script>

<template>
  <UPage>
    <UPageHeader
      :title="post!.title"
      :description="post!.description"
    >
      <template #headline>
        <div class="flex flex-col gap-8">
          <UBreadcrumb
            :items="[{ label: 'Blog', to: '/blog' }, { label: post!.title }]"
          />
          <div class="flex items-center space-x-2">
            <UBadge
              :label="post?.category || 'Article'"
              color="neutral"
              variant="subtle"
            />
            <span class="text-gray-500 dark:text-gray-400">&middot;&nbsp;&nbsp;<time>{{ formatDate(post!.date) }}</time></span>
          </div>
        </div>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <div class="mt-4 flex flex-wrap items-center gap-6">
          <UButton
            v-for="author in post!.authors"
            :key="author.username"
            :to="author.to"
            target="_blank"
            color="neutral"
            variant="ghost"
            class="-my-1.5 -mx-2.5"
          >
            <UAvatar
              :src="author.avatar?.src"
              :alt="author.name"
            />

            <div class="text-left">
              <p class="font-medium">
                {{ author.name }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 leading-4">
                {{ `@${author.username}` }}
              </p>
            </div>
          </UButton>
        </div>
      </div>
    </UPageHeader>

    <UPageBody prose>
      <ContentRenderer
        v-if="post!.body"
        :value="post!"
      />
      <USeparator />
      <UContentSurround :surround="(surround as any)" />
    </UPageBody>
  </UPage>
</template>
