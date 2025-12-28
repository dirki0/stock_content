import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: 'postgres://postgres:7BN15SIRmEut7y4SHspWLi1WUWxBCmG8Pqhiz0KNF51buw9TO96Au8do7g9iLjpW@65.109.163.175:5433/postgres',
  },
  dialect: 'postgresql',
  out: './server/db/migrations',
  schema: './server/db/schema/index.ts',
})
