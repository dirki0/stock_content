import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  banExpires: timestamp('ban_expires'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  id: uuid('id').primaryKey(),
  image: text('image'),
  name: text('name').notNull(),
  polarCustomerId: text('polar_customer_id'),
  role: text('role'),
  stripeCustomerId: text('stripe_customer_id'),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable('session', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  id: uuid('id').primaryKey(),
  impersonatedBy: uuid('impersonated_by').references(() => user.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'),
  token: text('token').notNull().unique(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  accountId: text('account_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  id: uuid('id').primaryKey(),
  idToken: text('id_token'),
  password: text('password'),
  providerId: text('provider_id').notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const verification = pgTable('verification', {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  id: uuid('id').primaryKey(),
  identifier: text('identifier').notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  value: text('value').notNull(),
})

export const subscription = pgTable('subscription', {
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  id: uuid('id').primaryKey(),
  periodEnd: timestamp('period_end'),
  periodStart: timestamp('period_start'),
  plan: text('plan').notNull(),
  referenceId: text('reference_id').notNull(),
  seats: integer('seats'),
  status: text('status').default('incomplete'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  trialEnd: timestamp('trial_end'),
  trialStart: timestamp('trial_start'),
})

export const passkey = pgTable('passkey', {
  backedUp: boolean('backed_up').notNull(),
  counter: integer('counter').notNull(),
  createdAt: timestamp('created_at').notNull(),
  deviceType: text('device_type').notNull(),
  id: uuid('id').primaryKey(),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  transports: text('transports'),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  webauthnUserID: text('webauthn_user_id').notNull(),
})
