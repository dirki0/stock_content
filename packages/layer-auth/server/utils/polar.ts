import { checkout, polar, portal, usage, webhooks } from '@polar-sh/better-auth'
import { Polar } from '@polar-sh/sdk'

function createPolarClient () {
  return new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.POLAR_SERVER as 'production' | 'sandbox',
  })
}

export async function ensurePolarCustomer (user: User) {
  const client = createPolarClient()
  const { result: existingCustomers } = await client.customers.list({ email: user.email })
  const existingCustomer = existingCustomers.items[0]
  if (existingCustomer) {
    if (existingCustomer.externalId !== user.id) {
      await client.customers.update({
        customerUpdate: {
          externalId: user.id,
        },
        id: existingCustomer.id,
      })
    }
    return existingCustomer
  }
  else {
    const customer = await client.customers.create({
      email: user.email,
      externalId: user.id,
      name: user.name,
    })
    return customer
  }
}

export function setupPolar () {
  const runtimeConfig = useRuntimeConfig()
  const serverLogger = useServerLogger()

  return polar({
    client: createPolarClient(),
    createCustomerOnSignUp: true,
    use: [
      checkout({
        authenticatedUsersOnly: true,
        successUrl: '/dashboard',
      }),
      portal(),
      usage(),
      webhooks({
        onPayload: async (payload) => {
          // Catch-all for all events
          serverLogger.debug('Polar webhook received:', payload.type, payload.data)
        },
        // On Polar Organization Settings: {APP_URL}/api/auth/polar/webhooks
        secret: runtimeConfig.polarWebhookSecret,
      }),
    ],
  })
}
