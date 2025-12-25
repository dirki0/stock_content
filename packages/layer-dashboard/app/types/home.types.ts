export type Period = 'daily' | 'monthly' | 'weekly'

export interface Range {
  end: Date
  start: Date
}

export interface Stat {
  formatter?: (value: number) => string
  icon: string
  title: string
  value: number | string
  variation: number
}
