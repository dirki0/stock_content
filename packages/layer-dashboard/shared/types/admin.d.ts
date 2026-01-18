export type AdminUsersTableFilter = 'all' | 'proPlan' | 'unverified' | 'verified'

interface AdminUserSubscription {
  id: string
  name: string
  status: string
}

export interface AdminSelectUser extends User {
  hasLifeTimeDeal: boolean
  subscription: AdminUserSubscription | null
}

export interface AdminUsersResponse {
  page: number
  pageSize: number
  totalCount: number
  users: Array<AdminSelectUser>
}
