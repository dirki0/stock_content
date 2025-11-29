<script setup lang="ts">
import { z } from 'zod'

const emit = defineEmits<Emit>()
interface Emit {
  close: [email: string | undefined]
}
const open = defineModel('open', { required: true, type: Boolean })
const { t } = useI18n()

const isLoading = ref(false)
const schema = z.object({
  email: z.email('Invalid email'),
})

const state = reactive({
  email: '',
})

async function onSubmit () {
  isLoading.value = true
  try {
    emit('close', state.email)
    open.value = false
  }
  finally {
    isLoading.value = false
  }
}

function onCancel () {
  open.value = false
  emit('close')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('components.auth.passkey.register.title')"
    :description="t('components.auth.passkey.register.description')"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          :label="t('components.auth.passkey.register.emailLabel')"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            type="email"
            :placeholder="t('components.auth.passkey.register.emailPlaceholder')"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            :label="t('general.cancel')"
            color="neutral"
            variant="outline"
            @click="onCancel"
          />
          <UButton
            :loading="isLoading"
            icon="i-lucide-fingerprint"
            type="submit"
          >
            {{ t('components.auth.passkey.register.submitButton') }}
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
