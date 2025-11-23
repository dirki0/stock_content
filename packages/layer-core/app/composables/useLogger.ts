import type { ConsolaInstance, LogObject } from 'consola'
import { consola } from 'consola'

export interface Logger {
  debug: (msg: any | LogObject, ...args: Array<any>) => void
  error: (msg: any | LogObject, ...args: Array<any>) => void
  fatal: (msg: any | LogObject, ...args: Array<any>) => void
  info: (msg: any | LogObject, ...args: Array<any>) => void
  log: (msg: any | LogObject, ...args: Array<any>) => void
  success: (msg: any | LogObject, ...args: Array<any>) => void
  trace: (msg: any | LogObject, ...args: Array<any>) => void
  warn: (msg: any | LogObject, ...args: Array<any>) => void
}

export function useLogger (): Logger {
  const logger: ConsolaInstance = consola

  logger.wrapConsole()

  return {
    debug: (msg: any | LogObject, ...args: Array<any>) => logger.debug(msg, ...args),
    error: (msg: any | LogObject, ...args: Array<any>) => logger.error(msg, ...args),
    fatal: (msg: any | LogObject, ...args: Array<any>) => logger.fatal(msg, ...args),
    info: (msg: any | LogObject, ...args: Array<any>) => logger.info(msg, ...args),
    log: (msg: any | LogObject, ...args: Array<any>) => logger.log(msg, ...args),
    success: (msg: any | LogObject, ...args: Array<any>) => logger.success(msg, ...args),
    trace: (msg: any | LogObject, ...args: Array<any>) => logger.trace(msg, ...args),
    warn: (msg: any | LogObject, ...args: Array<any>) => logger.warn(msg, ...args),
  }
}
