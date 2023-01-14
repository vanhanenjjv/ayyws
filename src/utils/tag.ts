import { UnknownRecord } from '../types'

type TaggedRecord<Tag extends string, Record = UnknownRecord> = Record & { tag: Tag }

export const tag =
  <Tag extends string>(tag: Tag) =>
    <Record extends UnknownRecord>(record: Record): TaggedRecord<Tag, Record> => ({
      ...record,
      tag
    })
