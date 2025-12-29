export interface Banner {
  color: 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning'
  icon?: string
  isClosable?: boolean
  showUntil?: string
  target?: '_blank' | '_self'
  title: string
  to?: string
}
