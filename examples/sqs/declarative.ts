import { pipe } from 'fp-ts/function'
import * as Json from 'fp-ts/Json'
import * as Either from 'fp-ts/Either'
import * as TaskEither from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import { match } from 'ts-pattern'

import * as sqs from 'ayyws/sqs'
import { tag } from 'ayyws/utils'

const NotificationCodec = t.strict({
  id: t.string,
  message: t.string
})

type Notification = t.TypeOf<typeof NotificationCodec>

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

declare function insertNotificationIntoDatabase(notification: Notification):
  TaskEither.TaskEither<{ tag: 'insert_notification_into_database_error', error: Error }, void>

export const handler = sqs.makeHandler(record => pipe(
  record.body,
  parseNotification,
  TaskEither.fromEither,
  TaskEither.chainW(insertNotificationIntoDatabase),
  TaskEither.match(
    left => match(left)
      .with({ tag: 'parse_notification_from_json_error' }, sqs.retry)
      .with({ tag: 'decode_notification_error' }, sqs.retry)
      .with({ tag: 'insert_notification_into_database_error' }, sqs.retry)
      .exhaustive(),
    sqs.pass
  )
)())
