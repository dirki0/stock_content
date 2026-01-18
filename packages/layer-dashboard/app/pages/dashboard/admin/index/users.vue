<script lang="ts" setup>
import type { Row } from '@tanstack/vue-table'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const hasMaskedEmails = ref(true)
const search = ref((route.query.search as string) || '')
const selectedFilter = ref<AdminUsersTableFilter>(
  (route.query.filter as AdminUsersTableFilter) || 'all',
)
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 10)
const deletingUserId = ref<null | string>(null)
const debouncedSearch = refDebounced(search, 350)
const totalUsers = ref(0)

const showAddUserModal = ref(false)
const showBanUserModal = ref(false)
const showUnbanUserModal = ref(false)
const showSubscriptionModal = ref(false)
const selectedUser = ref<AdminSelectUser | null>(null)

const filters: Array<{ label: string, value: AdminUsersTableFilter }> = [
  { label: t('pages.admin.users.filters.all'), value: 'all' },
  { label: t('pages.admin.users.filters.verified'), value: 'verified' },
  { label: t('pages.admin.users.filters.unverified'), value: 'unverified' },
  { label: t('pages.admin.users.filters.proPlan'), value: 'proPlan' },
]

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { openDeleteConfirmationModal } = useConfirmationModal()
const { client } = useAuth()

const users = ref<Array<AdminSelectUser>>([])
const pending = ref(false)

async function fetchUsers () {
  pending.value = true

  try {
    const data = await $fetch('/api/dashboard/admin/users', {
      query: {
        filter: selectedFilter.value,
        page: page.value,
        pageSize: pageSize.value,
        search: debouncedSearch.value,
      },
    })

    users.value = data.users as unknown as Array<AdminSelectUser>
    totalUsers.value = data.totalCount
  }
  catch (error: any) {
    logger.error('Failed to fetch users', error)
    showErrorToast(t('pages.admin.users.toast.fetchError'), error)
  }
  finally {
    pending.value = false
  }
}

// Watch for changes and refetch
watch(
  [page, pageSize, debouncedSearch, selectedFilter],
  () => {
    fetchUsers()
  },
  { immediate: true },
)

// Sync query parameters with the browser URL
watch(
  [selectedFilter, page, pageSize, debouncedSearch],
  ([newFilter, newPage, newPageSize, newSearch]) => {
    const query = {
      filter: newFilter,
      page: newPage,
      pageSize: newPageSize,
      search: newSearch || undefined, // Remove empty search from URL
    }
    router.replace({ query })
  },
)

async function deleteUser (userId: string) {
  const confirmed = await openDeleteConfirmationModal({
    description: t('pages.admin.users.confirmDelete.description'),
    title: t('pages.admin.users.confirmDelete.title'),
  })

  if (!confirmed) {
    return
  }

  deletingUserId.value = userId
  const { error } = await client.admin.removeUser({ userId })

  if (error) {
    logger.error('Failed to delete user', error)
    showErrorToast(t('pages.admin.users.toast.deleteError'), error)
    return
  }

  showSuccessToast({ title: t('pages.admin.users.toast.deleteSuccess') })
  deletingUserId.value = null

  await fetchUsers()
}

async function impersonateUser (userId: string) {
  try {
    const { error } = await client.admin.impersonateUser({ userId })

    if (error) {
      logger.error('Failed to impersonate user', error)
      showErrorToast(t('pages.admin.users.toast.impersonateError'), error)
      return
    }

    showSuccessToast({
      title: t('pages.admin.users.toast.impersonateSuccess'),
    })
    // Reload the app to reflect the impersonated user
    reloadNuxtApp()
  }
  catch (error: any) {
    logger.error('Failed to impersonate user', error)
    showErrorToast(t('pages.admin.users.toast.impersonateError'), error)
  }
}

function openBanUnbanModal (user: AdminSelectUser) {
  selectedUser.value = user

  if (user.banned) {
    showUnbanUserModal.value = true
  }
  else {
    showBanUserModal.value = true
  }
}

watch(
  [showBanUserModal, showUnbanUserModal],
  ([newShowBanModal, newShowUnbanModal]) => {
    if (!newShowBanModal && !newShowUnbanModal) {
      selectedUser.value = null
      fetchUsers()
    }
  },
)

function getActionItems (row: Row<AdminSelectUser>) {
  const actionItems = [
    {
      icon: row.original.banned
        ? 'i-lucide-user-round-check'
        : 'i-lucide-user-round-x',
      label: row.original.banned
        ? t('pages.admin.users.tableActions.unbanUser')
        : t('pages.admin.users.tableActions.banUser'),
      onSelect: () => openBanUnbanModal(row.original),
    },
    {
      icon: 'i-lucide-trash',
      label: t('pages.admin.users.tableActions.deleteUser'),
      loading: deletingUserId.value === row.id,
      onSelect: () => deleteUser(row.original.id),
    },
    {
      icon: 'i-lucide-fire-extinguisher',
      label: t('pages.admin.users.tableActions.impersonateUser'),
      onSelect: () => impersonateUser(row.original.id),
    },
  ]

  if (row.original.subscription?.id) {
    actionItems.push({
      type: 'separator',
    })
    actionItems.push({
      icon: 'i-lucide-credit-card',
      label: t('pages.admin.users.tableActions.viewSubscription'),
      onSelect: () => {
        selectedUser.value = row.original
        showSubscriptionModal.value = true
      },
    })
  }

  return actionItems
}

watch(
  [showAddUserModal, showBanUserModal, showUnbanUserModal],
  (newShowAddUserModal, newShowBanUserModal, newShowUnbanUserModal) => {
    if (
      !newShowAddUserModal
      || !newShowBanUserModal
      || !newShowUnbanUserModal
    ) {
      fetchUsers()
    }
  },
)
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex items-center justify-between mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          color="neutral"
          :trailing="false"
          :placeholder="t('pages.admin.users.search.placeholder')"
        />
        <USelect
          v-model="selectedFilter"
          :items="filters"
        />
        <USwitch
          v-model="hasMaskedEmails"
          color="neutral"
          :label="t('pages.admin.users.maskEmails')"
        />
      </div>
      <div class="flex items-center gap-2">
        <UButton
          :label="t('pages.admin.users.addUserButton')"
          variant="soft"
          color="neutral"
          icon="i-lucide-plus"
          @click="showAddUserModal = true"
        />
      </div>
    </div>
    <AdminUsersTable
      :data="users as Array<AdminSelectUser>"
      :is-loading="pending"
      :total-rows="totalUsers"
      :page="page"
      :page-size="pageSize"
      :has-masked-emails="hasMaskedEmails"
      :get-action-items="getActionItems"
    />
    <div class="mt-4 flex items-center justify-between">
      <USelect
        v-model="pageSize"
        :items="[10, 20, 50, 100]"
        label="Rows per page"
      />
      <UPagination
        :page="page"
        :total="totalUsers"
        :per-page="pageSize"
        @update:page="page = $event"
      />
    </div>

    <AdminAddUserModal
      v-model="showAddUserModal"
      @added="fetchUsers"
    />
    <AdminBanUserModal
      v-if="selectedUser"
      v-model="showBanUserModal"
      :user="selectedUser"
    />
    <AdminUnbanUserModal
      v-if="selectedUser"
      v-model="showUnbanUserModal"
      :user="selectedUser"
    />
    <AdminSubscriptionModal
      v-if="selectedUser"
      v-model="showSubscriptionModal"
      :user="selectedUser"
    />
  </div>
</template>
