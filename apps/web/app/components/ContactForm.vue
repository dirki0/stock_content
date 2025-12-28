<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const schema = z.object({
  email: z.email(),
  message: z.string().min(10),
  name: z.string().min(3),
  website: z.string().optional(),
})
type Schema = z.output<typeof schema>

const { showErrorToast, showSuccessToast } = useAppToast()
const { t } = useI18n()
const logger = useLogger()

const state = reactive({
  email: '',
  message: '',
  name: '',
  website: '', // honeypot
})

const isSending = ref(false)

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isSending.value = true

  try {
    await $fetch('/api/contact', {
      body: event.data,
      method: 'POST',
    })
    showSuccessToast({ description: t('pages.contact.toast.success.description'), title: t('pages.contact.toast.success.title') })
  }
  catch (error: any) {
    logger.error('Failed to send contact mail', error)
    showErrorToast(t('pages.contact.toast.error.title'), error)
  }
  finally {
    isSending.value = false
  }
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    :disabled="isSending"
    class="flex flex-col gap-4 w-md"
    @submit="onSubmit"
  >
    <UFormField
      name="website"
      class="hidden"
    >
      <UInput v-model="state.website" />
    </UFormField>
    <UFormField
      :label="t('pages.contact.form.nameField.label')"
      name="name"
      size="lg"
      required
    >
      <UInput
        v-model="state.name"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="t('pages.contact.form.emailField.label')"
      name="email"
      size="lg"
      required
    >
      <UInput
        v-model="state.email"
        class="w-full"
      />
    </UFormField>
    <UFormField
      :label="t('pages.contact.form.messageField.label')"
      name="message"
      size="lg"
      required
    >
      <UTextarea
        v-model="state.message"
        class="w-full"
        :rows="6"
      />
    </UFormField>
    <UButton
      variant="soft"
      size="lg"
      type="submit"
      color="neutral"
      :loading="isSending"
      block
      icon="i-lucide-mail"
    >
      {{ t('pages.contact.form.submitButton') }}
    </UButton>
  </UForm>
</template>
