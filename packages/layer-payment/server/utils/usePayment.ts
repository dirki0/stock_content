import { Polar } from '@polar-sh/sdk'
import type { Product } from '@polar-sh/sdk/models/components/product.js'
import type { H3Event } from 'h3'

export function usePayment (event: H3Event) {
  const { private: { polarAccessToken, polarOrganizationId, polarServer } } = useRuntimeConfig(event)

  const polar = new Polar({
    accessToken: polarAccessToken,
    server: polarServer as 'production' | 'sandbox',
  })

  const getAllProducts = async (): Promise<Array<PaymentProduct>> => {
    const { result } = await polar.products.list({
      isArchived: false, // Only fetch products which are published
      organizationId: polarOrganizationId,
    })

    return result.items.map((product: Product) => {
      const price = product.prices[0]

      const paymentProduct: PaymentProduct = {
        currency: '',
        description: product.description ?? '',
        id: product.id,
        name: product.name,
        price: 0,
        type: product.isRecurring ? 'recurring' : 'one-time',
      }

      if (price?.recurringInterval && price.amountType === 'fixed') {
        paymentProduct.price = price.priceAmount
        paymentProduct.currency = price.priceCurrency
        paymentProduct.recurringInterval = price.recurringInterval
      }
      else if (price?.type === 'one_time' && price.amountType === 'fixed') {
        paymentProduct.price = price.priceAmount
        paymentProduct.currency = price.priceCurrency
      }

      return paymentProduct
    })
  }

  return {
    getAllProducts,
  }
}
