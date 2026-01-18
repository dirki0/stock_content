import type { AdminUsersTableFilter } from '#shared/types/admin'

export const adminUsersTableFilters = ['all', 'unverified', 'verified', 'proPlan'] satisfies Array<AdminUsersTableFilter>

export const zodEnum = <T>(array: Array<T>): [T, ...Array<T>] => array as [T, ...Array<T>]
