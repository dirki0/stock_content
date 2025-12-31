<script setup lang="ts">
const { t } = useI18n()
const title = computed(() => t('pages.dashboard.settings.links.security'))

useSeoMeta({
  title,
})
</script>

<template>
  <div class="space-y-8">
    <SettingsUpdatePassword />
  </div>
</template>
