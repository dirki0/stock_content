<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import type { Waitlist } from 'layer-auth/shared/types/db'

interface Props {
  data: Array<Waitlist>
  getActionItems: (row: Row<Waitlist>) => Array<any>
  isLoading: boolean
}
const props = defineProps<Props>()

const UIcon = resolveComponent('UIcon')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()

function formatDate (dateString: string) {
  return useDateFormat(new Date(dateString), 'DD MMM YY').value
}

const columns: Array<TableColumn<Waitlist>> = [
  {
    accessorKey: 'email',
    header: t('pages.admin.waitlist.tableHeaders.email'),
  },
  {
    accessorKey: 'emailVerified',
    cell: ({ row }) => {
      if (row.original.emailVerified) {
        return h(UIcon, { class: 'text-(--ui-success) text-2xl', name: 'i-lucide-circle-check' })
      }
      return h(UIcon, { class: 'text-2xl text-gray-300 dark:text-gray-600', name: 'i-lucide-circle' })
    },
    header: t('pages.admin.waitlist.tableHeaders.emailConfirmed'),
  },
  {
    accessorKey: 'referrer',
    cell: ({ row }) => row.original.referrer || '-',
    header: t('pages.admin.waitlist.tableHeaders.referrer'),
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => formatDate(row.original.createdAt as unknown as string),
    header: t('pages.admin.waitlist.tableHeaders.createdAt'),
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
    header: t('pages.admin.waitlist.tableHeaders.actions'),
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
