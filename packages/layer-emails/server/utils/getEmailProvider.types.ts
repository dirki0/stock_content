export interface SendEmailParams {
  from: string
  html?: string
  subject: string
  text?: string
  to: Array<string> | string
}

export type SendEmailHandler = (params: SendEmailParams) => Promise<void>

export interface EmailProvider {
  send: SendEmailHandler
}
