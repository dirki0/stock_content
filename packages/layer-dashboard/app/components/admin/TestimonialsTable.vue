<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import type { Testimonial } from 'layer-auth/shared/types/db'

interface Props {
  data: Array<Testimonial>
  getActionItems: (row: Row<Testimonial>) => Array<any>
  isLoading: boolean
}
const props = defineProps<Props>()

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()

function formatDate (dateString: string) {
  return useDateFormat(new Date(dateString), 'DD MMM YY').value
}

const columns: Array<TableColumn<Testimonial>> = [
  {
    accessorKey: 'author.name',
    cell: ({ row }) => row.original.author.name,
    header: t('pages.admin.testimonials.tableHeaders.author'),
  },
  {
    accessorKey: 'quote',
    cell: ({ row }) => {
      const quote = row.original.quote
      return quote.length > 100 ? `${quote.substring(0, 100)}...` : quote
    },
    header: t('pages.admin.testimonials.tableHeaders.quote'),
  },
  {
    accessorKey: 'source',
    cell: ({ row }) => row.original.source?.name || '-',
    header: t('pages.admin.testimonials.tableHeaders.source'),
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => formatDate(row.original.createdAt as unknown as string),
    header: 'Created At',
  },
  {
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: props.getActionItems(row),
          },
          () =>
            h(UButton, {
              color: 'neutral',
              icon: 'i-lucide-ellipsis',
              size: 'sm',
              variant: 'ghost',
            }),
        ),
      )
    },
    header: 'Actions',
    id: 'actions',
  },
]
</script>

<template>
  <UTable
    :columns="columns"
    :data="data"
    :loading="isLoading"
  />
</template>
