// This import ensures reflect-metadata is loaded before any other code
// that depends on it (e.g., tsyringe used by better-auth passkey plugin)
import 'reflect-metadata'

export default defineNitroPlugin(() => {
  // Polyfill is loaded via the import above
})
