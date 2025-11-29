<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const route = useRouter().currentRoute.value
const { token } = route.query

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { t } = useI18n()

const title = computed(() => t('pages.resetPassword.title'))
const description = computed(() => t('pages.resetPassword.description'))

const isLoading = ref(false)

const state = reactive({
  password: '',
  passwordConfirmation: '',
})

const schema = z
  .object({
    password: z.string().min(8, t('pages.resetPassword.form.password.validationMessage')),
    passwordConfirmation: z.string().min(8, t('pages.resetPassword.form.confirmPassword.validationMessage')),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: t('pages.resetPassword.form.matchPasswordValidationMessage'),
    path: ['passwordConfirmation'],
  })
type Schema = z.output<typeof schema>

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await $fetch('/api/auth/reset-password', {
      body: { code: token, password: event.data.password },
      method: 'PATCH',
    })

    showSuccessToast({
      description: t('pages.resetPassword.toast.success.description'),
      title: t('pages.resetPassword.toast.success.title'),
    })

    await navigateTo('/auth/login')
  }
  catch (error: any) {
    logger.error('Reset password failed', error)
    showErrorToast(t('pages.resetPassword.toast.error.title'), error)
  }
  finally {
    isLoading.value = false
  }
}

definePageMeta({
  middleware: 'reset-password',
})

useSeoMeta({
  description,
  title,
})

defineOgImageComponent('OgImageTemplate')
</script>

<template>
  <div class="flex justify-center">
    <UPageCard
      :title="title"
      :description="description"
      class="w-full max-w-md md:mt-12"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 max-w-sm"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('pages.resetPassword.form.password.label')"
          name="password"
          size="lg"
          required
        >
          <UInput
            v-model="state.password"
            type="password"
            class="w-full"
          />
        </UFormField>
        <UFormField
          :label="t('pages.resetPassword.form.confirmPassword.label')"
          name="passwordConfirmation"
          size="lg"
          required
        >
          <UInput
            v-model="state.passwordConfirmation"
            type="password"
            class="w-full"
          />
        </UFormField>
        <UButton
          :loading="isLoading"
          color="neutral"
          type="submit"
          :disabled="isLoading"
          size="lg"
          block
        >
          {{ $t('pages.resetPassword.form.submitButton') }}
        </UButton>
      </UForm>
    </UPageCard>
  </div>
</template>
