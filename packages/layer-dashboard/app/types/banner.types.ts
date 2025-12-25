import { z } from 'zod'

export const bannerSchema = z.object({
  color: z.enum(['error', 'info', 'neutral', 'primary', 'secondary', 'success', 'warning']),
  icon: z.string().optional(),
  isClosable: z.boolean(),
  target: z.enum(['_blank', '_self']).optional(),
  title: z.string().min(3),
  to: z.string().optional(),
})
export type BannerSchema = z.output<typeof bannerSchema>

export const bannerNestedSchema = z.object({
  showUntilDateTime: z.iso.datetime(),
})
export type BannerNestedSchema = z.output<typeof bannerNestedSchema>
