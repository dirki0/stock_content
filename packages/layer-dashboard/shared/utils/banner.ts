import { desc, eq } from 'drizzle-orm'
import { banner } from 'layer-auth/server/db/schema'
import type { Banner, BannerInsert } from 'layer-auth/shared/types/db'

const LOGGER_PREFIX = '[useBanner]:'

export function useBanner () {
  const serverLogger = useServerLogger()
  const db = useDb()

  const getAllItems = async () => {
    try {
      const records = await db
        .select()
        .from(banner)
        .orderBy(desc(banner.createdAt))
      return records
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get banners`, error)
      return []
    }
  }

  const getActiveItem = async () => {
    try {
      const items = await db
        .select()
        .from(banner)
        .where(eq(banner.isActive, true))
        .limit(1)

      return items[0] || null
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get active banner`, error)
      return null
    }
  }

  const getItemById = async (id: string) => {
    try {
      const items = await db
        .select()
        .from(banner)
        .where(eq(banner.id, id))

      return items[0] || null
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get banner by ID ${id}`, error)
      throw new Error('Failed to get banner by ID')
    }
  }

  const addItem = async (payload: BannerInsert) => {
    try {
      const record = await db
        .insert(banner)
        .values(payload)
        .returning()
      return record[0]
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to add banner`, error)
      throw new Error('Failed to add banner')
    }
  }

  const updateItem = async (id: string, item: Partial<Banner>) => {
    try {
      const record = await db
        .update(banner)
        .set({ ...item, updatedAt: new Date() })
        .where(eq(banner.id, id))
        .returning()
      return record[0]
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to update banner`, error)
      throw new Error('Failed to update banner')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const record = await db
        .delete(banner)
        .where(eq(banner.id, id))
        .returning()
      return record[0]
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to delete banner`, error)
      throw new Error('Failed to delete banner')
    }
  }

  const activateBanner = async (id: string) => {
    try {
      // Use transaction to ensure atomicity
      await db.transaction(async (tx) => {
        // Deactivate all banners
        await tx
          .update(banner)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(banner.isActive, true))

        // Activate the specified banner
        await tx
          .update(banner)
          .set({ isActive: true, updatedAt: new Date() })
          .where(eq(banner.id, id))
      })

      return await getItemById(id)
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to activate banner ${id}`, error)
      throw new Error('Failed to activate banner')
    }
  }

  return {
    activateBanner,
    addItem,
    deleteItem,
    getActiveItem,
    getAllItems,
    getItemById,
    updateItem,
  }
}
