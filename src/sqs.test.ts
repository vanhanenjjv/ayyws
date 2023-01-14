/* eslint-disable @typescript-eslint/no-empty-function */

import { Context, SQSEvent, SQSRecord } from 'aws-lambda'
import { it, describe, expect, vi } from 'vitest'

import * as sqs from './sqs'

describe('makeHandler', () => {
  it('should return batch item failure for retried record', async () => {
    const handler = sqs.makeHandler(vi.fn().mockResolvedValueOnce(sqs.retry()))
    const event: SQSEvent = { Records: [{ messageId: '1' } as SQSRecord] }
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      batchItemFailures: [{ itemIdentifier: '1' }]
    })
  })

  it('should not return batch item failure for passed record', async () => {
    const handler = sqs.makeHandler(vi.fn().mockResolvedValueOnce(sqs.pass()))
    const event: SQSEvent = { Records: [{ messageId: '1' } as SQSRecord] }
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      batchItemFailures: []
    })
  })

  it('should work with multiple records', async () => {
    const handler = sqs.makeHandler(
      vi.fn()
        .mockResolvedValueOnce(sqs.pass())
        .mockResolvedValueOnce(sqs.retry())
        .mockResolvedValueOnce(sqs.pass())
        .mockResolvedValueOnce(sqs.pass())
    )
    const event: SQSEvent = {
      Records: Array.from({ length: 4 }).map((_, index): SQSRecord => ({
        messageId: (++index).toString()
      } as SQSRecord))
    }
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      batchItemFailures: [{ itemIdentifier: '2' }]
    })
  })

  it('should work with single record', async () => {
    const handler = sqs.makeHandler(vi.fn().mockResolvedValueOnce(sqs.pass()))
    const event: SQSEvent = { Records: [{ messageId: '1' } as SQSRecord] }
    const response = await handler(event, {} as Context, () => { })
    expect(response).toEqual({
      batchItemFailures: []
    })
  })

  it('should reject when handler throws', async () => {
    const handler = sqs.makeHandler(vi.fn().mockRejectedValueOnce(new Error('Unmanaged Error')))
    const event: SQSEvent = { Records: [{ messageId: '1' } as SQSRecord] }
    const response = handler(event, {} as Context, () => { })
    await expect(response).rejects.toEqual(new Error('Unmanaged Error'))
  })
})
