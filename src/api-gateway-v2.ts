import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
  Callback,
  Context
} from 'aws-lambda'
import { UnknownRecord } from './types'
import { merge } from './utils/merge'

type Headers = Record<string, string | number | boolean>

const getBody = (body: string | UnknownRecord): string => {
  if (typeof body === 'string') return body
  return JSON.stringify(body)
}

const appendContentTypeHeader = (headers: Headers): Headers => ({ ...headers, 'Content-Type': 'application/json' })

const getHeaders = (headers: Headers, body: unknown): Headers => {
  if (typeof body === 'string') return headers
  if ('Content-Type' in headers) return headers
  return appendContentTypeHeader(headers)
}

interface ResponseOptions extends UnknownRecord {
  statusCode?: number
  headers?: Headers
  body?: string | Record<string, unknown>
}

interface ResponseDefaults extends UnknownRecord {
  statusCode: number
  body: string
}

type ResponseFunction = (options?: ResponseOptions) => APIGatewayProxyResultV2

const response = (defaults: ResponseDefaults): ResponseFunction => options => {
  const { body, statusCode, headers } = merge(defaults, options ?? {})
  return {
    statusCode,
    body: getBody(body),
    headers: getHeaders(headers ?? {}, body)
  }
}

export const badRequest = response({ body: 'Bad request', statusCode: 400 })
export const internalServerError = response({ body: 'Internal server error', statusCode: 500 })
export const notFound = response({ body: 'Not found', statusCode: 404 })
export const ok = response({ body: 'Ok', statusCode: 200 })
export const unauthorized = response({ body: 'Unauthorized', statusCode: 401 })
export const forbidden = response({ body: 'Forbidden', statusCode: 403 })
export const conflict = response({ body: 'Conflict', statusCode: 409 })

type HandlerFunction = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback<APIGatewayProxyResultV2<never>>
) => Promise<APIGatewayProxyResultV2> | APIGatewayProxyResultV2

export const handler =
  (fn: HandlerFunction): APIGatewayProxyHandlerV2 =>
    (event, context, callback) =>
      Promise.resolve(fn(event, context, callback))
