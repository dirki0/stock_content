<script lang="ts" setup>
import type { Row } from '@tanstack/vue-table'
import type { Banner } from 'layer-auth/shared/types/db'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const search = ref((route.query.search as string) || '')
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 10)
const debouncedSearch = refDebounced(search, 350)
const totalItems = ref(0)

const showFormModal = ref(false)
const selectedBanner = ref<Banner | null>(null)

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { openDeleteConfirmationModal } = useConfirmationModal()

const banners = ref<Array<Banner>>([])
const pending = ref(false)

async function fetchBanners () {
  pending.value = true

  try {
    const data = await $fetch('/api/dashboard/admin/banner', {
      query: {
        page: page.value,
        pageSize: pageSize.value,
        search: debouncedSearch.value,
      },
    }) as { items: Array<Banner>, totalCount: number }

    banners.value = data.items
    totalItems.value = data.totalCount
  }
  catch (error: any) {
    logger.error('Failed to fetch banners', error)
    showErrorToast(t('pages.admin.banner.toast.fetchError'), error)
  }
  finally {
    pending.value = false
  }
}

// Watch for changes and refetch
watch(
  [page, pageSize, debouncedSearch],
  () => {
    fetchBanners()
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

async function deleteBanner (id: string) {
  const confirmed = await openDeleteConfirmationModal({
    description: t('pages.admin.banner.deleteConfirmationDescription'),
    title: t('pages.admin.banner.deleteConfirmationTitle'),
  })

  if (!confirmed) {
    return
  }

  try {
    await $fetch(`/api/dashboard/admin/banner/${id}`, {
      method: 'DELETE',
    })

    showSuccessToast({ title: 'Banner deleted' })
    await fetchBanners()
  }
  catch (error: any) {
    logger.error('Failed to delete banner', error)
    showErrorToast(t('pages.admin.banner.deleteError'), error)
  }
}

async function activateBanner (id: string) {
  try {
    await $fetch(`/api/dashboard/admin/banner/${id}/activate`, {
      method: 'POST',
    })

    showSuccessToast({ title: 'Banner activated' })
    await fetchBanners()
  }
  catch (error: any) {
    logger.error('Failed to activate banner', error)
    showErrorToast('Failed to activate banner', error)
  }
}

function openEditModal (banner: Banner) {
  selectedBanner.value = banner
  showFormModal.value = true
}

function openAddModal () {
  selectedBanner.value = null
  showFormModal.value = true
}

function getActionItems (row: Row<Banner>) {
  const items = [
    {
      icon: 'i-lucide-pencil',
      label: t('general.edit'),
      onSelect: () => openEditModal(row.original),
    },
  ]

  if (!row.original.isActive) {
    items.push({
      icon: 'i-lucide-check-circle',
      label: 'Activate',
      onSelect: () => activateBanner(row.original.id),
    })
  }

  items.push({
    icon: 'i-lucide-trash',
    label: t('general.delete'),
    onSelect: () => deleteBanner(row.original.id),
  })

  return items
}

watch(showFormModal, (newVal) => {
  if (!newVal) {
    selectedBanner.value = null
    fetchBanners()
  }
})
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex items-center justify-between mb-6">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        color="neutral"
        :trailing="false"
        placeholder="Search banners..."
      />
      <UButton
        :label="t('pages.admin.banner.addButton')"
        variant="soft"
        color="neutral"
        icon="i-lucide-plus"
        @click="openAddModal"
      />
    </div>

    <AdminBannerTable
      :data="banners"
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

    <AdminBannerFormModal
      v-model="showFormModal"
      :banner="selectedBanner"
    />
  </div>
</template>
