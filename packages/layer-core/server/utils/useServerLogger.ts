import consola from 'consola'

interface ServerLogger {
  debug: (message: string, ...args: Array<any>) => void
  error: (message: string, error: Error, data?: Record<string, any>) => void
  info: (message: string, ...args: Array<any>) => void
  verbose: (message: string, ...args: Array<any>) => void
  warn: (message: string, ...args: Array<any>) => void
}

export function useServerLogger (): ServerLogger {
  return {
    debug: (message: string, ...args: Array<any>) => consola.debug(message, ...args),
    error: (message: string, ...args: Array<any>) => consola.error(message, ...args),
    info: (message: string, ...args: Array<any>) => consola.info(message, ...args),
    verbose: (message: string, ...args: Array<any>) => consola.verbose(message, ...args),
    warn: (message: string, ...args: Array<any>) => consola.warn(message, ...args),
  }
}
