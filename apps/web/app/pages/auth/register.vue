<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { PasskeyRegisterModal } from '#components'
import * as z from 'zod'

const auth = useAuth()
const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { t } = useI18n()
const overlay = useOverlay()
const modal = overlay.create(PasskeyRegisterModal)

const isLoading = ref(false)

const title = computed(() => t('pages.register.title'))
const description = computed(() => t('pages.register.description'))

async function handlePasskeyRegister () {
  isLoading.value = true

  const email = await modal.open()
  if (!email) {
    isLoading.value = false
    showErrorToast(t('components.auth.toast.passkeyRegisterError.label'), `${t('components.auth.passkey.register.emailRequired')}`)
    return
  }

  // FIXME: Passkey registration is currently disabled
  // const { error } = await client.passkey.addPasskey({
  //   name: email,
  // })
  //
  // if (error) {
  //   const errorMessage = error.message || t('components.auth.toast.passkeyRegisterError.label')
  //   showErrorToast(t('components.auth.toast.passkeyRegisterError.label'), errorMessage)
  // }
  // else {
  //   showSuccessToast({
  //     description: t('components.auth.toast.passkeyRegisterSuccess.description'),
  //     title: t('components.auth.toast.passkeyRegisterSuccess.label'),
  //   })
  //
  //   await navigateTo('/dashboard')
  // }

  isLoading.value = false
}

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
    await navigateTo('/api/auth/google', { external: true })
  },
}, {
  icon: 'i-simple-icons-github',
  label: 'GitHub',
  onClick: async () => {
    await navigateTo('/api/auth/github', { external: true })
  },
}, {
  icon: 'i-lucide-fingerprint',
  label: 'Passkey',
  loading: isLoading.value,
  onClick: async () => {
    await handlePasskeyRegister()
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

  const { data, error } = await auth.signUp.email({
    callbackURL: `/auth/otp/verify?email=${encodeURIComponent(payload.data.email)}&type=SIGNUP`,
    email: payload.data.email,
    name: payload.data.name,
    password: payload.data.password,
    polarCustomerId: '', // FIXME:  Integrate Polar customer ID
  })

  if (error) {
    // FIXME: Detailed Zod error handling
    // if (error && error.data && error.data.name === 'ZodError') {
    //   const issues = error.data.issues
    //     .map((issue: any) => {
    //       const path = issue.path.join('.')
    //       return `Invalid ${path}: ${issue.message}`
    //     })
    //     .join('\n')
    //   logger.error(issues)
    // }
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
            to="/auth/login"
            class="text-(--ui-primary) font-medium"
          >
            {{ $t('pages.register.signIn') }}
          </ULink>.
        </template>

        <template #footer>
          By signing up, you agree to our <ULink
            to="/legal/terms"
            class="text-(--ui-primary) font-medium"
          >
            Terms of Service
          </ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
