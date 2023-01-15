/* eslint-disable @typescript-eslint/no-empty-function */
import { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda'
import { it, expect } from 'vitest'

import { handler } from './declarative'

it('should not return batch item failure when record is valid', async () => {
  const event = { Records: [{ messageId: '1', body: JSON.stringify({ id: '1', message: 'hello!' }) }] } as Partial<SQSEvent> as SQSEvent
  const response = await handler(event, {} as Context, () => { }) as unknown as Promise<SQSBatchResponse>
  expect(response).toEqual({
    batchItemFailures: []
  })
})

it('should return batch item failure when record body is not valid JSON', async () => {
  const event = { Records: [{ messageId: '1', body: '<span>not valid JSON<span>' }] } as Partial<SQSEvent> as SQSEvent
  const response = await handler(event, {} as Context, () => { }) as unknown as Promise<SQSBatchResponse>
  expect(response).toEqual({
    batchItemFailures: [{ messageIdentifier: '1' }]
  })
})

it('should return batch item failure when record body does not conform to codec', async () => {
  const event = { Records: [{ messageId: '1', body: JSON.stringify({ message: 'hello!' }) }] } as Partial<SQSEvent> as SQSEvent
  const response = await handler(event, {} as Context, () => { }) as unknown as Promise<SQSBatchResponse>
  expect(response).toEqual({
    batchItemFailures: [{ messageIdentifier: '1' }]
  })
})


