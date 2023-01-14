import {
  SQSHandler,
  SQSRecord,
  Context,
  SQSBatchResponse,
  Callback
} from 'aws-lambda'

/* Created with retry and pass functions. */
type Result =
  | { retry: true }
  | { retry: false }

/* When . */
declare function retry(): Result

/* Signal to not be retried. */
declare function pass(): Result

/* Function with similar interface to SQSHandler with two notable differences:
   1. It is applied to SQSRecord instead of SQSEvent.
   2. It expects a Result object in response.
*/
type HandlerFunction = (
  /* Record that is being processed. */
  record: SQSRecord,
  /* Passed directly from SQSHandler. */
  context: Context,
  /* Passed directly from SQSHandler. */
  callback: Callback<void | SQSBatchResponse>
  /* Signals the handler. */
) => Promise<Result> | Result

/* Transforms given HandlerFunction into SQSHandler. */
declare function makeHandler(fn: HandlerFunction): SQSHandler
