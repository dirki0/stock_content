import { desc, eq } from 'drizzle-orm'
import { testimonial } from 'layer-auth/server/db/schema'
import type { Testimonial, TestimonialInsert } from 'layer-auth/shared/types/db'

const LOGGER_PREFIX = '[useTestimonials]:'

export function useTestimonials () {
  const serverLogger = useServerLogger()
  const db = useDb()

  const getAllItems = async () => {
    try {
      const records = await db
        .select()
        .from(testimonial)
        .orderBy(desc(testimonial.createdAt))
      return records
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get testimonials`, error)
      return []
    }
  }

  const getItemById = async (id: string) => {
    try {
      const items = await db
        .select()
        .from(testimonial)
        .where(eq(testimonial.id, id))

      return items[0] || null
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get testimonial by ID ${id}`, error)
      throw new Error('Failed to get testimonial by ID')
    }
  }

  const addItem = async (payload: TestimonialInsert) => {
    try {
      const record = await db
        .insert(testimonial)
        .values(payload)
        .returning()
      return record[0]
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to add testimonial`, error)
      throw new Error('Failed to add testimonial')
    }
  }

  const updateItem = async (id: string, item: Partial<Testimonial>) => {
    try {
      const record = await db
        .update(testimonial)
        .set({ ...item, updatedAt: new Date() })
        .where(eq(testimonial.id, id))
        .returning()
      return record[0]
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to update testimonial`, error)
      throw new Error('Failed to update testimonial')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const record = await db
        .delete(testimonial)
        .where(eq(testimonial.id, id))
        .returning()
      return record[0]
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to delete testimonial`, error)
      throw new Error('Failed to delete testimonial')
    }
  }

  return {
    addItem,
    deleteItem,
    getAllItems,
    getItemById,
    updateItem,
  }
}
