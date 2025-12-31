<script setup lang="ts">
import type { BlobObject } from '@nuxthub/core'
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const isLoading = ref(false)

const { t } = useI18n()
const logger = useLogger()
const { showErrorToast, showSuccessToast } = useAppToast()
const { fetch: refreshSession, user } = useUserSession()

const schema = z.object({
  avatarUrl: z.string().optional(),
  name: z.string().min(1, t('pages.dashboard.settings.updateProfile.form.name.validationMessage')),
})
type Schema = z.output<typeof schema>

const state = ref({
  avatarUrl: user.value?.avatarUrl || '',
  name: user.value?.name || '',
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await $fetch('/api/auth/user', {
      body: event.data,
      method: 'PATCH',
    })
    await refreshSession()
    showSuccessToast({
      description: t('pages.dashboard.settings.updateProfile.toast.success.description'),
      title: t('pages.dashboard.settings.updateProfile.toast.success.title'),
    })
  }
  catch (error: any) {
    logger.error('Failed to update profile', error)
    showErrorToast(t('pages.dashboard.settings.updateProfile.toast.error.title'), error)
  }
  finally {
    isLoading.value = false
  }
}

async function onUploadImage (blob: BlobObject) {
  state.value.avatarUrl = blob.pathname
}
</script>

<template>
  <UForm
    v-if="user"
    :schema="schema"
    :state="state"
    @submit="onSubmit"
  >
    <UPageCard
      :title="t('pages.dashboard.settings.updateProfile.title')"
      :description="t('pages.dashboard.settings.updateProfile.description') "
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        :loading="isLoading"
        :disabled="isLoading"
        :label="t('pages.dashboard.settings.updateProfile.form.submitButton')"
        color="neutral"
        type="submit"
        class="w-fit ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        :label="t('pages.dashboard.settings.updateProfile.form.avatar.label')"
        size="lg"
        name="avatarUrl"
      >
        <AvatarUploader
          api-url="/api/auth/user/avatar"
          :image-path-name="state.avatarUrl"
          @upload="onUploadImage"
        />
      </UFormField>
      <UFormField
        :label="t('pages.dashboard.settings.updateProfile.form.email.label')"
        size="lg"
        aria-readonly="true"
        readonly
      >
        <div
          class="cursor-not-allowed opacity-75 border-0 rounded-md text-sm px-3.5 py-2.5 shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
        >
          <span>{{ user.email }}</span>
        </div>
      </UFormField>
      <UFormField
        :label="t('pages.dashboard.settings.updateProfile.form.accountId.label')"
        size="lg"
        aria-readonly="true"
      >
        <div
          class="cursor-not-allowed opacity-75 border-0 rounded-md text-sm px-3.5 py-2.5 shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
        >
          <span>{{ user.id }}</span>
        </div>
      </UFormField>
      <UFormField
        :label="t('pages.dashboard.settings.updateProfile.form.fullName.label')"
        size="lg"
        name="name"
      >
        <UInput v-model="state.name" />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
