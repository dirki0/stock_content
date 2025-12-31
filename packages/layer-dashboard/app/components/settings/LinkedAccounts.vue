<script setup lang="ts">
const auth = useAuth()

const linkedAccounts = ref<Array<{
  accountId: string
  createdAt: Date
  id: string
  providerId: string
  scopes: Array<string>
  updatedAt: Date
  userId: string
}>>([])
const isLoading = ref(true)
const providerIdToUnlink = ref<null | string>(null)

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { t } = useI18n()

function getProviderIcon (providerId: string) {
  const icons: Record<string, string> = {
    github: 'i-simple-icons-github',
    google: 'i-simple-icons-google',
    twitter: 'i-simple-icons-x',
  }
  return icons[providerId.toLowerCase()] || 'i-lucide-link'
}

function formatDate (dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

async function fetchLinkedAccounts () {
  isLoading.value = true

  const { data, error } = await auth.client.listAccounts()

  if (error) {
    logger.error('Failed to fetch linked accounts', error)
    showErrorToast(t('pages.dashboard.settings.linkedAccounts.toast.error.fetchLinkedAccountsTitle'), error)
    linkedAccounts.value = []
  }
  else {
    linkedAccounts.value = data || []
  }

  isLoading.value = false
}

async function unlinkAccount (providerId: string) {
  providerIdToUnlink.value = providerId

  const { error } = await auth.client.unlinkAccount({
    providerId,
  })

  if (error) {
    logger.error('Failed to unlink account', error)
    showErrorToast(t('pages.dashboard.settings.linkedAccounts.toast.error.unlinkAccountTitle'), error)
  }
  else {
    showSuccessToast({ title: t('pages.dashboard.settings.linkedAccounts.toast.success.unlinkAccountTitle') })
    await fetchLinkedAccounts()
  }

  providerIdToUnlink.value = null
}

onMounted(async () => {
  await fetchLinkedAccounts()
})
</script>

<template>
  <div>
    <UPageCard
      :title="t('pages.dashboard.settings.linkedAccounts.title')"
      :description="t('pages.dashboard.settings.linkedAccounts.description') "
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    />
    <UPageCard variant="subtle">
      <div
        v-if="isLoading"
        class="flex justify-center"
      >
        <UIcon
          name="i-lucide-loader"
          class="animate-spin"
        />
      </div>
      <div v-else-if="linkedAccounts">
        <div
          v-if="linkedAccounts.length === 0"
          class="text-center py-4"
        >
          <p>{{ $t('pages.dashboard.settings.linkedAccounts.noLinkedAccounts') }}</p>
        </div>
        <ul
          v-else
          role="list"
          class="divide-y divide-gray-100 dark:divide-gray-800"
        >
          <li
            v-for="account in linkedAccounts"
            :key="account.id"
            class="flex items-center justify-between gap-6 py-4"
          >
            <div class="flex gap-4">
              <UIcon
                :name="getProviderIcon(account.providerId)"
                class="h-6 w-6 flex-none rounded-full"
              />
              <div class="min-w-0 flex-auto flex items-center gap-2">
                <p class="text-sm font-semibold leading-6 capitalize">
                  {{ account.providerId }}
                </p>
                <p
                  v-if="account.createdAt"
                  class="mt-px truncate text-xs leading-5 text-gray-500"
                >
                  {{ $t('pages.dashboard.settings.linkedAccounts.connectedOn', { date: formatDate(account.createdAt as unknown as string) }) }}
                </p>
              </div>
            </div>
            <UButton
              color="error"
              variant="soft"
              icon="i-lucide-trash"
              :loading="providerIdToUnlink === account.providerId"
              :disabled="providerIdToUnlink === account.providerId"
              @click="unlinkAccount(account.providerId)"
            >
              {{ $t('pages.dashboard.settings.linkedAccounts.unlinkButton') }}
            </UButton>
          </li>
        </ul>
      </div>
    </UPageCard>
  </div>
</template>
