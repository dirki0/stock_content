<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import type { Banner } from 'layer-auth/shared/types/db'

interface Props {
  data: Array<Banner>
  getActionItems: (row: Row<Banner>) => Array<any>
  isLoading: boolean
}
const props = defineProps<Props>()

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

function formatDate (dateString: string) {
  return useDateFormat(new Date(dateString), 'DD MMM YY').value
}

const columns: Array<TableColumn<Banner>> = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'color',
    cell: ({ row }) => h(UBadge, { color: row.original.color as any, variant: 'subtle' }, row.original.color),
    header: 'Color',
  },
  {
    accessorKey: 'isActive',
    cell: ({ row }) => {
      return h(UBadge, {
        color: row.original.isActive ? 'success' : 'neutral',
        variant: 'subtle',
      }, row.original.isActive ? 'Active' : 'Inactive')
    },
    header: 'Status',
  },
  {
    accessorKey: 'isClosable',
    cell: ({ row }) => row.original.isClosable ? 'Yes' : 'No',
    header: 'Closable',
  },
  {
    accessorKey: 'showUntil',
    cell: ({ row }) => row.original.showUntil ? formatDate(row.original.showUntil as unknown as string) : 'No expiry',
    header: 'Show Until',
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
