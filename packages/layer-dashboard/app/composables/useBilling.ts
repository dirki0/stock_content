export function useBilling () {
  const products = useState<Array<PaymentProduct>>('dashboard:paymentProducts', () => [])
  const hasLifetimeDeal = ref(false)
  const isLoadingOrders = ref(false)
  const auth = useAuth()

  if (products.value.length === 0) {
    $fetch('/api/payment/products').then((_products) => {
      products.value = _products
    })
  }

  const lifeTimeDealProduct = computed(() => products.value.find(plan => plan.type === 'one-time'))

  isLoadingOrders.value = true
  auth.client.customer.orders.list({
    query: {
      limit: 10,
      page: 1,
      productBillingType: 'one_time',
    },
  }).then((res: any) => { // FIXME: type missing
    if (res.data.result.items.length > 0) {
      const orderItem = res.data.result.items[0]
      if (orderItem.productId === lifeTimeDealProduct.value?.id && orderItem.status === 'paid') {
        hasLifetimeDeal.value = true
      }
    }
  }).finally(() => {
    isLoadingOrders.value = false
  })

  const hasProPlan = computed(() => hasLifetimeDeal.value || auth.activeSubscription !== null)

  return {
    hasLifetimeDeal: computed(() => hasLifetimeDeal.value),
    hasProPlan,
    isLoadingOrders: computed(() => isLoadingOrders.value),
    products: computed(() => products.value),
  }
}
