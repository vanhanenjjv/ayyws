import { pipe } from 'fp-ts/function'
import * as Json from 'fp-ts/Json'
import * as Either from 'fp-ts/Either'
import * as t from 'io-ts'
import { match } from 'ts-pattern'

import * as http from '../../src/api-gateway-v2'
import { tag } from '../../src/utils'

const RequestCodec = t.strict({
  id: t.string,
  message: t.string
})

const parseRequest = (body: string | undefined) =>
  pipe(
    body,
    Either.fromPredicate(t.string.is, () => pipe(
      ({ body }),
      tag('request_body_is_undefined_error')
    )),
    Either.chainW(body => pipe(
      body,
      Json.parse,
      Either.mapLeft(error => pipe(
        ({ error, body }),
        tag('parse_request_from_json_error')
      ))
    )),
    Either.chainW(json => pipe(
      json,
      RequestCodec.decode,
      Either.mapLeft(errors => pipe(
        ({ errors, json, body }),
        tag('decode_request_error')
      ))
    ))
  )

export const handler = http.makeHandler(event => pipe(
  event.body,
  parseRequest,
  Either.match(
    left => match(left)
      .with({ tag: 'request_body_is_undefined_error' }, () =>
        http.badRequest({ body: { message: 'Request body is undefined' } }))
      .with({ tag: 'parse_request_from_json_error' }, ({ error }) =>
        http.badRequest({ body: { message: 'Request body is not a valid JSON', error } }))
      .with({ tag: 'decode_request_error' }, ({ errors }) =>
        http.badRequest({ body: { message: 'Request body does not match the expected format', errors } }))
      .exhaustive(),
    () => http.ok({ body: { message: 'Ok' } })
  )
))
