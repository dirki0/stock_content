import { passkeyClient } from '@better-auth/passkey/client'
import { polarClient } from '@polar-sh/better-auth/client'
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import type { RouteLocationRaw } from 'vue-router'

export function useAuth () {
  const url = useRequestURL()
  const headers = import.meta.server ? useRequestHeaders() : undefined

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers,
    },
    plugins: [
      inferAdditionalFields({
        user: {
          polarCustomerId: {
            type: 'string',
          },
        },
      }),
      adminClient(),
      polarClient(),
      passkeyClient(),
    ],
  })

  const session = useState<null | Session>('auth:session', () => null)
  const user = useState<null | User>('auth:user', () => null)
  const polarState = useState<CustomerState | null>('auth:polarState', () => null)
  const sessionFetching = import.meta.server ? ref(false) : useState('auth:sessionFetching', () => false)

  const fetchSession = async () => {
    if (sessionFetching.value) {
      return
    }
    sessionFetching.value = true
    const { data } = await client.getSession()
    session.value = data?.session as Session || null

    const userDefaults = {
      banExpires: null,
      banned: null,
      banReason: null,
      image: null,
      role: null,
      stripeCustomerId: null,
    }
    user.value = data?.user
      ? Object.assign({}, userDefaults, data.user)
      : null

    if (user.value) {
      const { data: customerState } = await client.customer.state()
      polarState.value = customerState
    }

    sessionFetching.value = false
    return data
  }

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal)
        return
      await fetchSession()
    })
  }

  return {
    activeSubscription: computed(() => {
      const activeSubscriptions = polarState.value?.activeSubscriptions ?? []
      return activeSubscriptions.length > 0 ? activeSubscriptions[0] : null
    }),
    client,
    errorCodes: client.$ERROR_CODES,
    fetchSession,
    isImpersonated: computed(() => !!session.value?.impersonatedBy),
    isUserAdmin: computed(() => (user.value?.role ?? '').toLowerCase() === 'admin'),
    loggedIn: computed(() => !!session.value),
    polarState: computed(() => polarState.value),
    resetPassword: client.resetPassword,
    sendVerificationEmail: client.sendVerificationEmail,
    session,
    signIn: client.signIn,
    async signOut ({ redirectTo }: { redirectTo?: RouteLocationRaw } = {}) {
      await client.signOut({
        fetchOptions: {
          onSuccess: async () => {
            session.value = null
            user.value = null
            if (redirectTo) {
              reloadNuxtApp({
                path: redirectTo.toString(),
              })
            }
          },
        },
      })
    },
    signUp: client.signUp,
    user,
  }
}
