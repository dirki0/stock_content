<script lang="ts" setup>
import type { Row } from '@tanstack/vue-table'
import type { Waitlist } from 'layer-auth/shared/types/db'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const search = ref((route.query.search as string) || '')
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 10)
const debouncedSearch = refDebounced(search, 350)
const totalItems = ref(0)

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { openDeleteConfirmationModal } = useConfirmationModal()

const waitlist = ref<Array<Waitlist>>([])
const pending = ref(false)

async function fetchWaitlist () {
  pending.value = true

  try {
    const data = await $fetch('/api/dashboard/admin/waitlist', {
      query: {
        page: page.value,
        pageSize: pageSize.value,
        search: debouncedSearch.value,
      },
    }) as { items: Array<Waitlist>, totalCount: number }

    waitlist.value = data.items
    totalItems.value = data.totalCount
  }
  catch (error: any) {
    logger.error('Failed to fetch waitlist', error)
    showErrorToast(t('pages.admin.waitlist.toast.fetchError'), error)
  }
  finally {
    pending.value = false
  }
}

// Watch for changes and refetch
watch(
  [page, pageSize, debouncedSearch],
  () => {
    fetchWaitlist()
  },
  { immediate: true },
)

// Sync query parameters with the browser URL
watch(
  [page, pageSize, debouncedSearch],
  ([newPage, newPageSize, newSearch]) => {
    const query = {
      page: newPage,
      pageSize: newPageSize,
      search: newSearch || undefined,
    }
    router.replace({ query })
  },
)

async function deleteWaitlistEntry (id: string) {
  const confirmed = await openDeleteConfirmationModal({
    description: t('pages.admin.waitlist.confirmDelete.description'),
    title: t('pages.admin.waitlist.confirmDelete.title'),
  })

  if (!confirmed) {
    return
  }

  try {
    await $fetch(`/api/dashboard/admin/waitlist/${id}`, {
      method: 'DELETE',
    })

    showSuccessToast({ title: t('pages.admin.waitlist.toast.deleteSuccess') })
    await fetchWaitlist()
  }
  catch (error: any) {
    logger.error('Failed to delete waitlist entry', error)
    showErrorToast(t('pages.admin.waitlist.toast.deleteError'), error)
  }
}

function getActionItems (row: Row<Waitlist>) {
  return [
    {
      icon: 'i-lucide-trash',
      label: t('general.delete'),
      onSelect: () => deleteWaitlistEntry(row.original.id),
    },
  ]
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex items-center justify-between mb-6">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        color="neutral"
        :trailing="false"
        placeholder="Search by email or referrer..."
      />
    </div>

    <AdminWaitlistTable
      :data="waitlist"
      :is-loading="pending"
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
        :total="totalItems"
        :per-page="pageSize"
        @update:page="page = $event"
      />
    </div>
  </div>
</template>
