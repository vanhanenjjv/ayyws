import {
  SQSRecord,
  SQSHandler,
  Callback,
  SQSBatchResponse,
  Context,
  SQSEvent
} from 'aws-lambda'

type Result =
  | { retry: true }
  | { retry: false }

export function retry(): Result {
  return { retry: true }
}

export function pass(): Result {
  return { retry: false }
}

type HandlerFunction =
  (
    record: SQSRecord,
    context: Context,
    callback: Callback<void | SQSBatchResponse>
  ) => Promise<Result> | Result

type ProcessRecordOutput = { record: SQSRecord, result: Result }

const processRecord =
  (fn: HandlerFunction, context: Context, callback: Callback<void | SQSBatchResponse>) =>
    async (record: SQSRecord): Promise<ProcessRecordOutput> => {
      const output = await Promise.resolve(fn(record, context, callback))
      return { record, result: output }
    }

const processEvent =
  (fn: HandlerFunction, event: SQSEvent, context: Context, callback: Callback<void | SQSBatchResponse>) =>
    event.Records.map(processRecord(fn, context, callback))

const filterRetriedRecords = (outputs: ProcessRecordOutput[]) =>
  outputs.filter(({ result }) => result.retry)

const mapToBatchResponse = (outputs: ProcessRecordOutput[]): SQSBatchResponse => ({
  batchItemFailures: outputs.map(({ record }) => ({
    itemIdentifier: record.messageId
  }))
})

export const handler =
  (fn: HandlerFunction): SQSHandler =>
    (event, context, callback) =>
      Promise.all(processEvent(fn, event, context, callback))
        .then(filterRetriedRecords)
        .then(mapToBatchResponse)
