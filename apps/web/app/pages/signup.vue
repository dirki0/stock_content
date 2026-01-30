<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const auth = useAuth()
const { showErrorToast, showSuccessToast } = useAppToast()
// const logger = useLogger()
const { t } = useI18n()

const isLoading = ref(false)

const title = computed(() => t('pages.register.title'))
const description = computed(() => t('pages.register.description'))

const fields = [{
  label: t('pages.register.nameField.label'),
  name: 'name',
  placeholder: t('pages.register.nameField.placeholder'),
  required: true,
  type: 'text' as const,
}, {
  label: t('pages.register.emailField.label'),
  name: 'email',
  placeholder: t('pages.register.emailField.placeholder'),
  required: true,
  type: 'text' as const,
}, {
  label: t('pages.register.passwordField.label'),
  name: 'password',
  placeholder: t('pages.register.passwordField.placeholder'),
  required: true,
  type: 'password' as const,
}]

const providers = computed(() => ([{
  icon: 'i-simple-icons-google',
  label: 'Google',
  onClick: async () => {
    await auth.signIn.social({
      provider: 'google',
    })
  },
}, {
  icon: 'i-simple-icons-github',
  label: 'GitHub',
  onClick: async () => {
    await auth.signIn.social({
      provider: 'github',
    })
  },
}]))

const schema = z.object({
  email: z.email(),
  name: z.string().min(1).max(255),
  password: z.string().min(8),
})

type Schema = z.output<typeof schema>

async function onSubmit (payload: FormSubmitEvent<Schema>) {
  isLoading.value = true

  const { error } = await auth.signUp.email({
    email: payload.data.email,
    name: payload.data.name,
    password: payload.data.password,
    polarCustomerId: '',
  })

  if (error) {
    showErrorToast(t('components.auth.toast.signupError.label'), error)
  }
  else {
    showSuccessToast({ title: t('components.auth.toast.signupSuccess.label') })
  }

  isLoading.value = false
}

useSeoMeta({
  description,
  title,
})

defineOgImageComponent('OgImageTemplate')

definePageMeta({
  auth: {
    only: 'guest',
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md md:mt-12">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        :title="$t('pages.register.title')"
        icon="i-lucide-user"
        :submit="{
          label: $t('pages.register.createButton'),
        }"
        @submit="onSubmit"
      >
        <template #description>
          {{ $t('pages.register.alreadyAccount') }} <ULink
            to="/login"
            class="text-primary font-medium"
          >
            {{ $t('pages.register.signIn') }}
          </ULink>.
        </template>

        <template #footer>
          By signing up, you agree to our <ULink
            to="/legal/terms"
            class="text-primary font-medium"
          >
            Terms of Service
          </ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
