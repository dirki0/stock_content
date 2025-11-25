<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { showErrorToast, showSuccessToast } = useAppToast()
const { t } = useI18n()
const { client } = useAuth()

const isLoading = ref(false)
const passkeyError = ref('')

const title = computed(() => t('pages.login.title'))
const description = computed(() => t('pages.login.description'))

async function handlePasskeyAuthenticate () {
  isLoading.value = true
  passkeyError.value = ''

  // FIXME: Passkey authentication is currently disabled
  // await client.signIn.passkey({
  //   autoFill: true,
  //   fetchOptions: {
  //     onError (context) {
  //       passkeyError.value = context.error.message || 'Failed to authenticate'
  //       showErrorToast(t('components.auth.toast.passkeyLoginError.label'), passkeyError.value)
  //
  //       isLoading.value = false
  //     },
  //     async onSuccess () {
  //       showSuccessToast({
  //         description: t('components.auth.toast.passkeyLoginSuccess.description'),
  //         title: t('components.auth.toast.passkeyLoginSuccess.label'),
  //       })
  //
  //       await navigateTo('/dashboard')
  //
  //       isLoading.value = false
  //     },
  //   },
  // })
}

const fields = [{
  label: t('pages.login.emailField.label'),
  name: 'email',
  placeholder: t('pages.login.emailField.placeholder'),
  required: true,
  type: 'text' as const,
}, {
  label: t('pages.login.passwordField.label'),
  name: 'password',
  placeholder: t('pages.login.passwordField.placeholder'),
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
    await handlePasskeyAuthenticate()
  },
}]))

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

type Schema = z.output<typeof schema>

async function loginWithPassword (email: string, password: string) {
  isLoading.value = true

  const { error } = await client.signIn.email({
    callbackURL: '/dashboard',
    email,
    password,
    rememberMe: true,
  })

  isLoading.value = false

  if (error) {
    showErrorToast(t('components.auth.toast.loginError.label'), error)
  }
  else {
    showSuccessToast({ title: t('components.auth.toast.loginSuccess.label') })
  }
}

async function onSubmit (payload: FormSubmitEvent<Schema>) {
  await loginWithPassword(payload.data.email, payload.data.password)
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
      <UAlert
        :title="t('pages.login.demoAdmin.title')"
        :description="t('pages.login.demoAdmin.description')"
        icon="i-lucide-user"
        color="warning"
        variant="soft"
        :actions="[
          {
            label: t('pages.login.demoAdmin.actionButtonLabel'),
            color: 'neutral',
            onClick: async () => {
              await loginWithPassword('demo-admin@nuxtstarterkit.com', 'demoAdminNuxtStarterKit0815#')
            },
          },
        ]"
      />
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        :title="$t('pages.login.title')"
        icon="i-lucide-lock"
        :submit="{
          label: $t('pages.login.loginButton'),
        }"
        @submit="onSubmit"
      >
        <template #description>
          Don't have an account? <ULink
            to="/auth/register"
            class="text-(--ui-primary) font-medium"
          >
            {{ $t('pages.login.signUp') }}
          </ULink>.
        </template>

        <template #password-hint>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-(--ui-primary) font-medium"
          >
            {{ $t('pages.login.forgotPassword') }}
          </NuxtLink>
        </template>
        <template #footer>
          By signing in, you agree to our <ULink
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
