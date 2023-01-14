/* eslint-disable @typescript-eslint/no-empty-function */

import { APIGatewayProxyEventV2, Context } from 'aws-lambda'
import { it, describe, expect, vi } from 'vitest'

import * as http from './api-gateway-v2'

describe('API Gateway v2 (HTTP API)', () => {
  it('should return default "ok" response', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.ok()))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Ok',
      headers: {},
      statusCode: 200
    })
  })

  it('should return default "not found" response', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.notFound()))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Not found',
      headers: {},
      statusCode: 404
    })
  })

  it('should return default "internal server error" response', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.internalServerError()))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Internal server error',
      headers: {},
      statusCode: 500
    })
  })

  it('should return default "bad request" response', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.badRequest()))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Bad request',
      headers: {},
      statusCode: 400
    })
  })

  it('should return default "unauthorized" response', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.unauthorized()))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Unauthorized',
      headers: {},
      statusCode: 401
    })
  })

  it('should return default "forbidden" response', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.forbidden()))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Forbidden',
      headers: {},
      statusCode: 403
    })
  })

  it('should overwrite default body when provided in options', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.ok({ body: 'Hello World' })))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Hello World',
      headers: {},
      statusCode: 200
    })
  })

  it('should add "Content-Type" header set as "application/json" when provided with body that is not string', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.ok({ body: { message: 'Hello World' } })))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: '{"message":"Hello World"}',
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200
    })
  })

  it('should allow overwriting status code', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.badRequest({ statusCode: 200 })))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: 'Bad request',
      headers: {},
      statusCode: 200
    })
  })

  it('should not overwrite user defined "Content-Type" header', async () => {
    const handler = http.makeHandler(vi.fn().mockResolvedValueOnce(http.ok({ body: { message: 'Hello!' }, headers: { 'Content-Type': 'text/plain' } })))
    const event = {} as APIGatewayProxyEventV2
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      body: JSON.stringify({ message: 'Hello!' }),
      headers: { 'Content-Type': 'text/plain' },
      statusCode: 200
    })
  })
})
