import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const userRoles = ['user', 'admin'] as const
export type UserRole = (typeof userRoles)[number]

export const sessionStatuses = ['active', 'revoked'] as const
export type SessionStatus = (typeof sessionStatuses)[number]

export const users = sqliteTable('users', {
  // Timestamps stored as ISO strings for simplicity
  createdAt: text('created_at').notNull(),
  email: text('email').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  id: text('id').primaryKey(), // better-auth uses string ids by default
  image: text('image'),
  name: text('name'),
  role: text('role', { enum: userRoles }).notNull().default('user').$type<UserRole>(),
  updatedAt: text('updated_at').notNull(),
})

export const sessions = sqliteTable('sessions', {
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  id: text('id').primaryKey(),
  idleExpiresAt: text('idle_expires_at'),
  ipAddress: text('ip_address'),
  refreshToken: text('refresh_token'),
  status: text('status', { enum: sessionStatuses }).notNull().default('active').$type<SessionStatus>(),
  // session token (for cookies) and optional refresh token
  token: text('token').notNull().unique(),
  updatedAt: text('updated_at').notNull(),
  // metadata
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = sqliteTable('accounts', {
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  id: text('id').primaryKey(),
  // Raw provider profile as JSON string
  profile: text('profile'),
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  refreshToken: text('refresh_token'),
  scope: text('scope'),
  tokenType: text('token_type'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const verificationTokens = sqliteTable('verification_tokens', {
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(), // e.g. email
  token: text('token').notNull(),
  type: text('type').notNull(), // e.g. "email_verification", "password_reset"
})

export const keys = sqliteTable('keys', {
  createdAt: text('created_at').notNull(),
  // Hashed secrets (password, passkey challenge, etc.)
  hashedPassword: text('hashed_password'),
  id: text('id').primaryKey(),
  // Any additional metadata for the key, stored as JSON string
  metadata: text('metadata'),
  providerId: text('provider_id'),
  providerUserId: text('provider_user_id'),
  // Strategy / type (e.g. "email", "oauth", "passkey")
  type: text('type').notNull(),
  updatedAt: text('updated_at').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})

export const passkeys = sqliteTable('passkeys', {
  // signature counter; 0 is a valid initial value
  counter: integer('counter').notNull().default(0),
  createdAt: text('created_at').notNull(),
  // opaque credential ID from WebAuthn, stored as base64url or similar
  credentialId: text('credential_id').notNull().unique(),
  // authenticator device type / transport info; stored as JSON/text
  device: text('device'),
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  publicKey: text('public_key').notNull(),
  updatedAt: text('updated_at').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
})
