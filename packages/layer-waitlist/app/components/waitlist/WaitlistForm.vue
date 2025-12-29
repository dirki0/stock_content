<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const schema = z.object({
  email: z.email(),
})
type Schema = z.output<typeof schema>

const { showErrorToast, showSuccessToast } = useAppToast()
const { t } = useI18n()
const logger = useLogger()

const state = reactive({
  email: '',
})

const isLoading = ref(false)

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await $fetch('/api/waitlist/subscribe', {
      body: event.data,
      method: 'POST',
    })
    showSuccessToast({ description: t('components.waitlistForm.toast.subscribe.success.description'), title: t('components.waitlistForm.toast.subscribe.success.title') })
  }
  catch (error: any) {
    logger.error('Failed to subscribe', error)
    showErrorToast(t('components.waitlistForm.toast.subscribe.error.title'), error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    :disabled="isLoading"
    @submit="onSubmit"
  >
    <UFormField
      :help="t('components.waitlistForm.help')"
      name="email"
      size="lg"
      class="min-w-sm px-2 md:min-w-md"
    >
      <UInput
        v-model="state.email"
        type="email"
        placeholder="you@mail.com"
        :ui="{ trailing: 'pe-1' }"
        class="w-full"
      >
        <template #trailing>
          <UButton
            size="sm"
            type="submit"
            :loading="isLoading"
            variant="soft"
          >
            {{ t('components.waitlistForm.subscribeButton') }}
          </UButton>
        </template>
      </UInput>
    </UFormField>
  </UForm>
</template>
