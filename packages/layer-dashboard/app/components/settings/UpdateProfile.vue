<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const isLoading = ref(false)

const { t } = useI18n()
const logger = useLogger()
const auth = useAuth()
const { showErrorToast, showSuccessToast } = useAppToast()

const user = computed(() => auth.user.value)

const schema = z.object({
  imageUrl: z.string().optional(),
  name: z.string().min(1, t('pages.dashboard.settings.updateProfile.form.name.validationMessage')),
})
type Schema = z.output<typeof schema>

const state = ref({
  imageUrl: auth.user.value?.image || '',
  name: auth.user.value?.name || '',
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  const { error } = await auth.client.updateUser({
    image: event.data.imageUrl,
    name: event.data.name,
  })

  if (error) {
    logger.error('Failed to update profile', error)
    showErrorToast(t('pages.dashboard.settings.updateProfile.toast.error.title'), error)
  }
  else {
    showSuccessToast({
      description: t('pages.dashboard.settings.updateProfile.toast.success.description'),
      title: t('pages.dashboard.settings.updateProfile.toast.success.title'),
    })
  }

  isLoading.value = false
}

async function onUploadImage () {
  // state.value.avatarUrl = blob.pathname
}
</script>

<template>
  <UForm
    v-if="auth.user"
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
        <DashboardAvatarUploader
          :image-path-name="state.imageUrl"
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
