import { pipe } from 'fp-ts/function'
import * as Json from 'fp-ts/Json'
import * as Either from 'fp-ts/Either'
import * as t from 'io-ts'
import { match } from 'ts-pattern'

import * as sqs from '../../src/sqs'
import { tag } from '../../src/utils'

const NotificationCodec = t.strict({
  id: t.string,
  message: t.string
})

const parseNotification = (body: string) =>
  pipe(
    body,
    Json.parse,
    Either.mapLeft(error => pipe(
      ({ error, body }),
      tag('parse_notification_from_json_error')
    )),
    Either.chainW(json => pipe(
      json,
      NotificationCodec.decode,
      Either.mapLeft(errors => pipe(
        ({ errors, json, body }),
        tag('decode_notification_error')
      ))
    ))
  )

export const handler = sqs.makeHandler(record => pipe(
  record.body,
  parseNotification,
  Either.match(
    left => match(left)
      .with({ tag: 'parse_notification_from_json_error' }, () => sqs.retry())
      .with({ tag: 'decode_notification_error' }, () => sqs.retry())
      .exhaustive(),
    () => sqs.pass()
  )
))
