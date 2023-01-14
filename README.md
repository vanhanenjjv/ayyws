# ayyws 

My utility functions for developing AWS Lambda functions.

## [sqs.ts](./src/sqs.ts)

```ts
import {
  SQSHandler,
  SQSRecord,
  Context,
  SQSBatchResponse,
  Callback
} from 'aws-lambda'

/* Created with retry and pass functions. */
type Result =
  /* Record should be retried. */
  | { retry: true }
  /* Record should not be retried. */
  | { retry: false }

/* Creates a result value that signals the SQSHandler 
   wrapper function to retry record. */
declare function retry(): Result

/* Creates a result value that signals the SQSHandler 
   wrapper function to not retry record. */
declare function pass(): Result

/* Function with similar interface to SQSHandler with two notable differences:
   1. It is applied to a record instead of the event.
   2. It expects a Result object in return.
*/
type HandlerFunction = (
  /* Record that is being processed. Passed by the SQSHandler wrapper. */
  record: SQSRecord,
  /* Passed directly by the SQSHandler wrapper. */
  context: Context,
  /* Passed directly by the SQSHandler wrapper. */
  callback: Callback<void | SQSBatchResponse>
  /* The return value is used by the SQSHandler 
     wrapper to keep track of the records to be retried. */
) => Promise<Result> | Result

/* Creates a SQSHandler wrapper function which applies the given
   HandlerFunction individually to each record. */
declare function makeHandler(fn: HandlerFunction): SQSHandler
```
