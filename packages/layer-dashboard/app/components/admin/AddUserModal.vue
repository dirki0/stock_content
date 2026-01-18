<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

interface Emits {
  added: []
}
const emit = defineEmits<Emits>()

const open = defineModel({ default: false, type: Boolean })

const isLoading = ref(false)

const { t } = useI18n()
const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()

const form = useTemplateRef('form')

const schema = z.object({
  email: z.email(),
  emailVerified: z.boolean().optional(),
  name: z.string().min(1).max(255),
  password: z.string().min(8),
})
type Schema = z.output<typeof schema>

const state = reactive({
  email: '',
  emailVerified: true,
  name: '',
  password: '',
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  isLoading.value = true

  try {
    await $fetch('/api/admin/users', { body: event.data, method: 'POST' })
    showSuccessToast({ title: t('pages.admin.toast.createSuccess') })
    isLoading.value = false
    open.value = false
    emit('added')
  }
  catch (error: any) {
    if (error.data && error.data.data && error.data.data.name === 'ZodError') {
      const issues = error.data.data.issues
        .map((issue: any) => {
          const path = issue.path.join('.')
          return `Invalid ${path}: ${issue.message}`
        })
        .join('\n')
      logger.error(issues)
    }
    showErrorToast(t('pages.admin.toast.createError'), error)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('pages.admin.users.addUserModal.title')"
  >
    <template #body>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('pages.admin.users.addUserModal.form.name.label')"
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
          :label="t('pages.admin.users.addUserModal.form.email.label')"
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
          :label="t('pages.admin.users.addUserModal.form.password.label')"
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
          name="emailVerified"
          size="lg"
          :help="state.emailVerified ? t('pages.admin.users.addUserModal.form.emailVerified.helpSend') : t('pages.admin.users.addUserModal.form.emailVerified.helpNotSend')"
        >
          <UCheckbox
            v-model="state.emailVerified"
            :label="t('pages.admin.users.addUserModal.form.emailVerified.label')"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        variant="soft"
        color="neutral"
        size="lg"
        :loading="isLoading"
        :disabled="isLoading"
        @click="form?.submit"
      >
        {{ $t('pages.admin.users.addUserModal.form.submitButton') }}
      </UButton>
    </template>
  </UModal>
</template>
