type UnknownRecord = Record<string | number | symbol, unknown>

type TaggedRecord<Tag extends string, Record = UnknownRecord> = Record & { tag: Tag }

export function tag<Tag extends string>(tag: Tag) {
  return function<Record extends UnknownRecord>(record: Record): TaggedRecord<Tag, Record> {
    return {
      ...record,
      tag
    }
  }
}
