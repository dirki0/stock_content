<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

interface Props {
  data: Array<AdminSelectUser>
  getActionItems: (row: Row<AdminSelectUser>) => Array<any>
  hasMaskedEmails: boolean
  isLoading: boolean
}
const props = defineProps<Props>()

const UUser = resolveComponent('UUser')
const UIcon = resolveComponent('UIcon')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const Icon = resolveComponent('Icon')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()

function formatDate (dateString: string) {
  return useDateFormat(new Date(dateString), 'DD MMM YY').value
}

function timeAgo (dateString: string) {
  return useTimeAgo(new Date(dateString)).value
}

function getProviderIcon (providerId: string) {
  const icons: Record<string, string> = {
    github: 'i-simple-icons-github',
    google: 'i-simple-icons-google',
    twitter: 'i-simple-icons-x',
  }
  return icons[providerId.toLowerCase()] || 'i-lucide-link'
}

function getMaskedEmail (email: string) {
  if (!props.hasMaskedEmails) {
    return email
  }

  const [localPart, domain] = email.split('@')
  if (!domain || !localPart) {
    return email
  }

  const maskedLocal = localPart[0] + '•'.repeat(Math.max(localPart.length - 1, 2))
  return `${maskedLocal}@${domain}`
}

const columns: Array<TableColumn<AdminSelectUser>> = [
  {
    accessorKey: 'id',
    header: t('pages.admin.users.tableHeaders.id'),
  },
  {
    accessorKey: 'avatarUrl',
    cell: ({ row }) => {
      return h(UUser, {
        avatar: {
          alt: row.original.name,
          size: 'sm',
          src: row.original.avatarUrl,
        },
        name: row.original.name,
      })
    },
    header: t('pages.admin.users.tableHeaders.avatar'),
  },
  {
    accessorKey: 'name',
    header: t('pages.admin.users.tableHeaders.name'),
  },
  {
    accessorKey: 'email',
    cell: ({ row }) => getMaskedEmail(row.original.email),
    header: t('pages.admin.users.tableHeaders.email'),
  },
  {
    accessorKey: 'emailVerified',
    cell: ({ row }) => {
      if (row.original.emailVerified) {
        return h(UIcon, { class: 'text-(--ui-success) text-2xl', name: 'i-lucide-circle-check' })
      }
      return h(UIcon, { class: 'text-2xl text-gray-300 dark:text-gray-600', name: 'i-lucide-circle' })
    },
    header: t('pages.admin.users.tableHeaders.verified'),
  },
  {
    accessorKey: 'banned',
    cell: ({ row }) => {
      if (row.original.banned) {
        return h(UIcon, { class: 'text-(--ui-error) text-2xl', name: 'i-lucide-circle-check' })
      }
      return h(UIcon, { class: 'text-2xl text-gray-300 dark:text-gray-600', name: 'i-lucide-circle' })
    },
    header: t('pages.admin.users.tableHeaders.banned'),
  },
  {
    accessorKey: 'role',
    cell: ({ row }) => {
      return h(UBadge, { color: row.original.role === 'ADMIN' ? 'warning' : 'neutral', variant: 'subtle' }, row.original.role)
    },
    header: t('pages.admin.users.tableHeaders.role'),
  },
  {
    accessorKey: 'subscription',
    cell: ({ row }) => {
      const badgeColor = row.original.subscription?.name || row.original.hasLifeTimeDeal ? 'primary' : 'neutral'
      const badgeText = row.original.hasLifeTimeDeal ? 'Lifetime Deal' : row.original.subscription?.name ?? 'Free'
      return h(UBadge, { color: badgeColor, variant: 'subtle' }, badgeText)
    },
    header: t('pages.admin.users.tableHeaders.plan'),
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => formatDate(row.original.createdAt as unknown as string),
    header: t('pages.admin.users.tableHeaders.createdAt'),
  },
  {
    accessorKey: 'lastActive',
    cell: ({ row }) => timeAgo(row.original.lastActive as unknown as string),
    header: t('pages.admin.users.tableHeaders.lastActive'),
  },
  {
    accessorKey: 'linkedAccounts',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-x-2' }, row.original.linkedAccounts?.map((providerId: string) => {
        return h(Icon, { class: 'h-4 w-4', name: getProviderIcon(providerId) })
      }))
    },
    header: t('pages.admin.users.tableHeaders.linkedAccounts'),
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
              class: 'ml-auto',
              color: 'neutral',
              icon: 'i-lucide-ellipsis-vertical',
              variant: 'ghost',
            }),
        ),
      )
    },
    id: 'actions',
  },
]
</script>

<template>
  <UTable
    :loading="isLoading"
    :data="data"
    :columns="columns"
  />
</template>
