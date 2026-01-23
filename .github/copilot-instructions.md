# Nuxt Starter Kit - AI Coding Assistant Guide

## Architecture Overview

This is a **Turborepo monorepo** using **pnpm workspaces** and **Nuxt 4 layers** for a modular SaaS application.

### Layer Dependency Graph

```
apps/web extends:
  ├─ layer-dashboard (requires layer-auth, layer-payment, layer-storage)
  ├─ layer-testimonials (requires layer-auth)
  ├─ layer-blog (requires layer-core)
  ├─ layer-waitlist (requires layer-auth)
  └─ layer-docs (requires layer-auth)

layer-dashboard extends:
  ├─ layer-auth
  ├─ layer-payment (requires layer-auth)
  └─ layer-storage (requires layer-auth)

layer-auth extends:
  ├─ layer-core (base layer with @nuxt/ui, i18n, SEO)
  └─ layer-emails (requires layer-core)
```

**Critical:** Layers are referenced by name only (e.g., `'layer-auth'`), not by path. They're workspace packages in `packages/`.

## Development Workflow

### Essential Commands

```bash
# Start dev server for web app (runs on port 9009)
pnpm dev:web

# Turborepo commands (run from root)
pnpm build          # Build all packages
pnpm lint           # Lint all packages
pnpm lint:fix       # Auto-fix linting issues
pnpm typecheck      # TypeScript check all packages

# Database migrations (run from packages/layer-auth)
cd packages/layer-auth
pnpm db:generate    # Generate migrations from schema
pnpm db:migrate     # Apply migrations
```

### Environment Setup

Copy `.env.example` to `.env` and configure:
- **Required:** `NUXT_PRIVATE_DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- Database schema is in `packages/layer-auth/server/db/schema/`
- Uses **Drizzle ORM** with **PostgreSQL**

## Project-Specific Conventions

### 1. Shared Configuration via Catalog

Dependencies are centralized in `pnpm-workspace.yaml` catalog:

```yaml
catalog:
  nuxt: ^4.2.2
  zod: 4.2.1
```

Reference in `package.json` as: `"nuxt": "catalog:"`

### 2. Database Schema & Auth

- **Database:** All schemas in `packages/layer-auth/server/db/schema/`
  - `auth.ts` - User, session, account, passkey (better-auth tables)
  - `testimonial.ts`, `waitlist.ts`, `file.ts` - Feature tables
- **Authentication:** Uses `better-auth` with plugins:
  - `@better-auth/passkey` - WebAuthn/passkey support
  - `@polar-sh/better-auth` - Polar.sh payment integration
  - Server auth utilities: `useServerAuth()`, `requireAuth()`, `getAuthSession()`
  - Client auth: `useAuth()` composable (auto-imported)

### 3. Standard Composables (Auto-imported)

- `useAppToast()` - Standardized toast notifications (success, error, info, warn)
- `useLogger()` - Wrapped consola logger (debug, error, info, warn, etc.)
- `useI18n()` - @nuxtjs/i18n for translations (default: 'en', also supports 'de')
- `useAuth()` - Better-auth client with `user`, `session`, `client` properties

### 4. Component & Page Patterns

**Form Handling:**
```vue
<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({ email: z.email() })
type Schema = z.output<typeof schema>

const state = ref({ email: '' })

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Use $fetch for API calls
  await $fetch('/api/endpoint', { method: 'POST', body: event.data })
}
</script>
```

**Error Handling Pattern:**
```typescript
const { showErrorToast, showSuccessToast } = useAppToast()
const logger = useLogger()

try {
  await $fetch('/api/endpoint')
  showSuccessToast({ title: 'Success' })
} catch (error) {
  logger.error('Operation failed', error)
  showErrorToast({ title: 'Error', description: error.message })
}
```

### 5. Route Configuration

Pre-rendering and SSR/CSR modes configured in `apps/web/nuxt.config.ts`:

```typescript
routeRules: {
  '/': { prerender: true },
  '/dashboard/**': { ssr: false },  // Client-side only
  '/blog': { prerender: true },
  '/api/**': { cors: true },
}
```

### 6. Site Configuration

Centralized in `packages/site-config/siteConfig.ts`:
- Domain, logo URLs, social media links
- Referenced throughout layers for SEO, OG images, schema.org

### 7. ESLint Configuration

Uses `@antfu/eslint-config` with customizations:
- Single quotes, 2-space indent, no semicolons
- Array types: generic syntax (`Array<T>` not `T[]`)
- Space before function parens: required
- Shared config in `packages/eslint-config/`

### 8. Image Handling

Uses **TwicPics** image provider (CDN):
```typescript
image: {
  provider: 'twicpics',
  twicpics: {
    baseURL: siteConfig.imageProviderUrl
  }
}
```

## Database Utilities

```typescript
// Import from layer-auth server utils
import { useDb, eq, and, desc } from 'layer-auth/server/utils/db'

const db = useDb()
const users = await db.select().from(schema.user).where(eq(schema.user.email, email))
```

## Email System

Located in `packages/layer-emails/server`:
- `useEmail()` composable provides: `sendVerificationEmail()`, `sendPasswordResetEmail()`
- Email templates in `packages/layer-emails/app/emails/`

## Payment Integration

Uses **Polar.sh** for subscriptions:
- Configuration in `layer-payment` and `layer-auth`
- Client: `useBilling()` composable
- Server: `ensurePolarCustomer()` utility
- Environment vars: `POLAR_ACCESS_TOKEN`, `POLAR_SERVER`, `POLAR_ORGANIZATION_ID`

## Key Files to Reference

- **Layer structure:** `apps/web/nuxt.config.ts` (extends declaration)
- **Base config:** `packages/layer-core/nuxt.config.ts` (modules, i18n, SEO)
- **Auth setup:** `packages/layer-auth/server/utils/auth.ts`
- **Database schema:** `packages/layer-auth/server/db/schema/`
- **Shared types:** `packages/layer-auth/shared/types/db.ts`
- **Turbo config:** `turbo.json` (task dependencies)

## Anti-Patterns to Avoid

❌ Don't reference layers by path: `'../packages/layer-auth'`  
✅ Use layer name: `'layer-auth'`

❌ Don't create separate logger instances  
✅ Use `useLogger()` composable

❌ Don't use raw `console.log` in production code  
✅ Use `logger.info()`, `logger.error()`, etc.

❌ Don't hardcode site URLs  
✅ Import from `site-config` package

❌ Don't manually handle session state  
✅ Use `useAuth()` composable for client, `requireAuth()` for server
