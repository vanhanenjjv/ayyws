# ayyws (DISCLAIMER: Work in Progress)

My utility functions for developing AWS Lambda functions.

## [api-gateway-v2.ts](./src/api-gateway-v2.ts)

```ts
import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda'

interface ResponseOptions {
  /* Response status code. */
  statusCode?: number
  /* Response headers. */
  headers?: Headers
  /* Response body. If defined as an object it will JSON.stringify 
     the value and set the "Content-Type" header as "application/json" 
     if it is not already defined.
  */
  body?: string | Record<string, unknown>
}

/* Interface for a response function that returns an API Gateway V2 compatible response. */
type ResponseFunction = (
  /* Overwritten default options. */
  options?: ResponseOptions
) => APIGatewayProxyResultV2

/* Response functions. They create response objects with default values. */
declare const badRequest: ResponseFunction          // 400, "Bad Request"
declare const internalServerError: ResponseFunction // 500, "Internal Server Error"
declare const notFound: ResponseFunction            // 404, "Not Found"
declare const ok: ResponseFunction                  // 200, "Ok"
declare const unauthorized: ResponseFunction        // 401, "Unauthorized"
declare const forbidden: ResponseFunction           // 403, "Forbidden"
declare const conflict: ResponseFunction            // 409, "Conflict"

type HandlerFunction = APIGatewayProxyHandlerV2

/* Not really required, but exists to keep the API consistent with other service wrappers. */
declare function makeHandler(fn: HandlerFunction): APIGatewayProxyHandlerV2
```
 ## [sqs.ts](./src/sqs.ts)

```ts
import {
  SQSHandler,
  SQSRecord,
  Context,
  SQSBatchResponse,
  Callback
} from 'aws-lambda'

/* Is not exported and should be created with retry and pass functions. */
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

