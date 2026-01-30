<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const { showErrorToast, showSuccessToast } = useAppToast()
const { t } = useI18n()
const { client } = useAuth()

const isLoading = ref(false)

const title = computed(() => t('pages.login.title'))
const description = computed(() => t('pages.login.description'))

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
    await client.signIn.social({
      provider: 'google',
    })
  },
}, {
  icon: 'i-simple-icons-github',
  label: 'GitHub',
  onClick: async () => {
    await client.signIn.social({
      provider: 'github',
    })
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

definePageMeta({
  auth: {
    only: 'guest',
  },
})
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
            to="/signup"
            class="text-primary font-medium"
          >
            {{ $t('pages.login.signUp') }}
          </ULink>.
        </template>

        <template #password-hint>
          <NuxtLink
            to="/forgot-password"
            class="text-primary font-medium"
          >
            {{ $t('pages.login.forgotPassword') }}
          </NuxtLink>
        </template>
        <template #footer>
          By signing in, you agree to our <ULink
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
