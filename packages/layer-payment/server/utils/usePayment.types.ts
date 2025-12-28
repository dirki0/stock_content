type PaymentProductType = 'one-time' | 'recurring'
type PaymentProductRecurringInterval = 'day' | 'month' | 'week' | 'year'

export interface PaymentProduct {
  currency: string
  description: string
  id: string
  name: string
  price: number
  recurringInterval?: PaymentProductRecurringInterval
  type: PaymentProductType
}
