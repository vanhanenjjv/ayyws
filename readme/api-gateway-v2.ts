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
