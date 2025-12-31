<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const isLoading = ref(false)

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { t } = useI18n()
const auth = useAuth()

const schema = z.object({
  currentPassword: z.string().min(8, t('pages.dashboard.settings.updatePassword.form.newPassword.validationMessage')),
  newPassword: z.string().min(8, t('pages.dashboard.settings.updatePassword.form.newPassword.validationMessage')),
})
type Schema = z.output<typeof schema>

const state = ref({
  currentPassword: '',
  newPassword: '',
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  const { error } = await auth.client.changePassword({
    ...event.data,
    revokeOtherSessions: true,
  })

  if (error) {
    logger.error('Failed to update password', error)
    showErrorToast(t('pages.dashboard.settings.updatePassword.toast.errorTitle'), error)
  }
  else {
    showSuccessToast({
      description: t('pages.dashboard.settings.updatePassword.toast.successDescription'),
      title: t('pages.dashboard.settings.updatePassword.toast.successTitle'),
    })
  }

  isLoading.value = false
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
  >
    <UPageCard
      :title="t('pages.dashboard.settings.updatePassword.title')"
      :description="t('pages.dashboard.settings.updatePassword.description') "
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        :label="t('pages.dashboard.settings.updatePassword.form.submitButton')"
        :loading="isLoading"
        :disabled="isLoading"
        color="neutral"
        type="submit"
        class="w-fit ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        :label="t('pages.dashboard.settings.updatePassword.form.currentPassword.label')"
        size="lg"
        name="password"
      >
        <UInput
          v-model="state.currentPassword"
          type="password"
          :placeholder="t('pages.dashboard.settings.updatePassword.form.currentPassword.placeholder')"
          class="w-full"
        />
      </UFormField>
      <UFormField
        :label="t('pages.dashboard.settings.updatePassword.form.newPassword.label')"
        size="lg"
        name="password"
      >
        <UInput
          v-model="state.newPassword"
          type="password"
          :placeholder="t('pages.dashboard.settings.updatePassword.form.newPassword.placeholder')"
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
