<script setup lang="ts">
const { t } = useI18n()

const title = computed(() => t('pages.changelog.title'))
const description = computed(() => t('pages.changelog.description'))

const versions = ref([
  {
    date: '2025-04-27',
    description: 'This page was created to provide users with a detailed view of the changes made to the application, including new features, bug fixes, and improvements.',
    title: 'Changelog Page',
    ui: {
      container: 'max-w-lg',
    },
  },
  {
    date: '2025-04-26',
    description: 'Added a new feature to enhance user experience.',
    title: 'New Feature Added',
    ui: {
      container: 'max-w-lg',
    },
  },
  {
    date: '2025-04-25',
    description: 'Fixed a critical bug that affected user login.',
    title: 'Bug Fixes',
    ui: {
      container: 'max-w-lg',
    },
  },
  {
    date: '2025-04-24',
    description: 'Improved performance and stability of the application.',
    title: 'Performance Improvements',
    ui: {
      container: 'max-w-lg',
    },
  },
  {
    date: '2025-04-23',
    description: 'Updated documentation to reflect recent changes.',
    title: 'Documentation Update',
    ui: {
      container: 'max-w-lg',
    },
  },
])

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
    <UChangelogVersions :versions="versions" />
  </AppPageContainer>
</template>
