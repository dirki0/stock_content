export default defineNuxtRouteMiddleware(async () => {
  const { isUserAdmin } = useAuth()

  if (!isUserAdmin.value) {
    return navigateTo('/dashboard')
  }
})
