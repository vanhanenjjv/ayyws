
import { it, describe, expect } from 'vitest'

import { merge } from './merge'

describe('merge', () => {
  it('should merge object entries', () => {
    const source = { a: 1, b: 2 }
    const target = { c: 3, d: 4 }
    const result = merge(source, target)
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 })
  })

  it('should overwrite source entries with target entries', () => {
    const source = { a: 1, b: 2 }
    const target = { b: 3, c: 4 }
    const result = merge(source, target)
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should overwrite source entries with non-object value type with object value', () => {
    const source = { a: 1, b: 2 }
    const target = { b: { c: 3 }, c: 4 }
    const result = merge(source, target)
    expect(result).toEqual({ a: 1, b: { c: 3 }, c: 4 })
  })
})
