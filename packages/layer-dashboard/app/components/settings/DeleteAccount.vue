<script lang="ts" setup>
const isLoading = ref(false)

const logger = useLogger()
const { showErrorToast, showSuccessToast } = useAppToast()
const auth = useAuth()
const { openDeleteConfirmationModal } = useConfirmationModal()
const { t } = useI18n()

async function onDeleteAccount () {
  const confirmed = await openDeleteConfirmationModal({ description: t('pages.dashboard.settings.deleteAccount.confirmModal.description'), title: t('pages.dashboard.settings.deleteAccount.confirmModal.title') })

  if (!confirmed) {
    return
  }

  isLoading.value = true

  try {
    await auth.client.deleteUser()

    showSuccessToast({
      description: t('pages.dashboard.settings.deleteAccount.toast.success.description'),
      title: t('pages.dashboard.settings.deleteAccount.toast.success.title'),
    })

    await navigateTo('/')
  }
  catch (error: any) {
    logger.error('Failed to delete account', error)
    showErrorToast(t('pages.dashboard.settings.deleteAccount.toast.error.title'), error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UPageCard
    :title="t('pages.dashboard.settings.deleteAccount.title')"
    :description="t('pages.dashboard.settings.deleteAccount.description')"
    variant="subtle"
    spotlight
    spotlight-color="error"
  >
    <template #footer>
      <UButton
        :label="t('pages.dashboard.settings.deleteAccount.deleteButton')"
        color="error"
        :loading="isLoading"
        icon="i-lucide-circle-alert"
        @click="onDeleteAccount"
      />
    </template>
  </UPageCard>
</template>
