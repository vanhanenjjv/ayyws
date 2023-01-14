import { UnknownRecord } from '../types'

const isRecord = (value: unknown): value is UnknownRecord => typeof value === 'object' && value !== null

const reducer = (acc: UnknownRecord, [key, value]: [string, unknown]): UnknownRecord => {
  if (!isRecord(value)) return { ...acc, [key]: value }
  const source = acc[key]
  if (!isRecord(source)) return { ...acc, [key]: value }
  return { ...acc, [key]: Object.entries(value).reduce(reducer, source) }
}

type Merge = <
  Source extends UnknownRecord = UnknownRecord,
  Target extends UnknownRecord = UnknownRecord
>(source: Source, target: Target) =>
  Target & Source

export const merge: Merge = (source, target) =>
  Object.entries(target).reduce(reducer, source) as typeof source & typeof target
