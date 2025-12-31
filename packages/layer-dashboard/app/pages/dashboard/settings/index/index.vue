<script setup lang="ts">
const { t } = useI18n()
const title = computed(() => t('pages.dashboard.settings.links.profile'))

useSeoMeta({
  title,
})
</script>

<template>
  <div
    class="space-y-8"
  >
    <SettingsUpdateProfile />
    <SettingsLinkedAccounts />
    <SettingsDeleteAccount />
  </div>
</template>
