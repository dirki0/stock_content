<script lang="ts" setup>
import type { Row } from '@tanstack/vue-table'
import type { Testimonial } from 'layer-auth/shared/types/db'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const search = ref((route.query.search as string) || '')
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 10)
const debouncedSearch = refDebounced(search, 350)
const totalItems = ref(0)

const showFormModal = ref(false)
const selectedTestimonial = ref<null | Testimonial>(null)

const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()
const { openDeleteConfirmationModal } = useConfirmationModal()

const testimonials = ref<Array<Testimonial>>([])
const pending = ref(false)

async function fetchTestimonials () {
  pending.value = true

  try {
    const data = await $fetch<{ items: Array<Testimonial>, totalCount: number }>('/api/dashboard/admin/testimonials', {
      query: {
        page: page.value,
        pageSize: pageSize.value,
        search: debouncedSearch.value,
      },
    })

    testimonials.value = data.items
    totalItems.value = data.totalCount
  }
  catch (error: any) {
    logger.error('Failed to fetch testimonials', error)
    showErrorToast(t('pages.admin.testimonials.toast.fetchError'), error)
  }
  finally {
    pending.value = false
  }
}

// Watch for changes and refetch
watch(
  [page, pageSize, debouncedSearch],
  () => {
    fetchTestimonials()
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

async function deleteTestimonial (id: string) {
  const confirmed = await openDeleteConfirmationModal({
    description: t('pages.admin.testimonials.confirmDelete.description'),
    title: t('pages.admin.testimonials.confirmDelete.title'),
  })

  if (!confirmed) {
    return
  }

  try {
    await $fetch(`/api/dashboard/admin/testimonials/${id}`, {
      method: 'DELETE',
    })

    showSuccessToast({ title: t('pages.admin.testimonials.toast.deletedSuccess') })
    await fetchTestimonials()
  }
  catch (error: any) {
    logger.error('Failed to delete testimonial', error)
    showErrorToast(t('pages.admin.testimonials.toast.deletedError'), error)
  }
}

function openEditModal (testimonial: Testimonial) {
  selectedTestimonial.value = testimonial
  showFormModal.value = true
}

function openAddModal () {
  selectedTestimonial.value = null
  showFormModal.value = true
}

function getActionItems (row: Row<Testimonial>) {
  return [
    {
      icon: 'i-lucide-pencil',
      label: t('general.edit'),
      onSelect: () => openEditModal(row.original),
    },
    {
      icon: 'i-lucide-trash',
      label: t('general.delete'),
      onSelect: () => deleteTestimonial(row.original.id),
    },
  ]
}

watch(showFormModal, (newVal) => {
  if (!newVal) {
    selectedTestimonial.value = null
    fetchTestimonials()
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
        placeholder="Search testimonials..."
      />
      <UButton
        :label="t('pages.admin.testimonials.addButton')"
        variant="soft"
        color="neutral"
        icon="i-lucide-plus"
        @click="openAddModal"
      />
    </div>

    <AdminTestimonialsTable
      :data="testimonials"
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

    <AdminTestimonialFormModal
      v-model="showFormModal"
      :testimonial="selectedTestimonial"
    />
  </div>
</template>
