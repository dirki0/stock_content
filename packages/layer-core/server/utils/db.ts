import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../schema'

export { and, eq, or, sql } from 'drizzle-orm'

export const tables = schema

export function useDB () {
  return drizzle(hubDatabase(), { schema })
}
