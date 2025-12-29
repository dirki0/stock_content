import { desc, eq } from 'drizzle-orm'
import { waitlist } from 'layer-auth/server/db/schema'
import type { WaitlistInsert } from 'layer-auth/shared/types/db'

const LOGGER_PREFIX = '[useWaitlist]:'

export function useWaitlist () {
  const serverLogger = useServerLogger()
  const db = useDb()

  const getItemById = async (id: string) => {
    try {
      const item = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.id, id))
      return item || null
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get waitlist item by user ID ${id}`, error)
      throw new Error('Failed to get waitlist item by user ID')
    }
  }

  const getItemByVerificationToken = async (emailVerificationToken: string) => {
    try {
      const items = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.emailVerificationToken, emailVerificationToken))

      return items[0] || null
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get waitlist item by email verification token: ${emailVerificationToken}`, error)
      throw new Error('Failed to get waitlist item by email verification token')
    }
  }

  const getItemByEmail = async (email: string) => {
    try {
      const items = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email))

      return items[0] || null
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get waitlist item for email: ${email}`, error)
      throw new Error('Failed to get waitlist item by email')
    }
  }

  const addItem = async (payload: WaitlistInsert) => {
    try {
      const record = await db
        .insert(waitlist)
        .values(payload)
        .onConflictDoUpdate({
          set: payload,
          target: waitlist.id,
        })
        .returning()
      return record
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to add waitlist item`, error)
      throw new Error('Failed to add waitlist item')
    }
  }

  const updateItem = async (item: Waitlist) => {
    try {
      const record = await db
        .update(waitlist)
        .set({ ...item })
        .returning()
      return record
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to update waitlist item`, error)
      throw new Error('Failed to update waitlist item')
    }
  }

  const deleteItem = async (id: string) => {
    try {
      const record = await db
        .delete(waitlist)
        .where(eq(waitlist.id, id))
        .returning()
      return record
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to delete waitlist item`, error)
      throw new Error('Failed to delete waitlist item')
    }
  }

  const getAllItems = async () => {
    try {
      const records = await db
        .select()
        .from(waitlist)
        .orderBy(desc(waitlist.createdAt))
      return records
    }
    catch (error: any) {
      serverLogger.error(`${LOGGER_PREFIX} Failed to get waitlist items`, error)
      return []
    }
  }

  return {
    addItem,
    deleteItem,
    getAllItems,
    getItemByEmail,
    getItemById,
    getItemByVerificationToken,
    updateItem,
  }
}
