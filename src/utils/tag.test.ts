
import { it, describe, expect } from 'vitest'

import { tag } from './tag'

describe('tag', () => {
  it('should add tag field to record', () => {
    const BadRequestError = tag('bad_request_error')
    const error = BadRequestError({ message: 'Body is undefined' })
    expect(error).toEqual({
      tag: 'bad_request_error',
      message: 'Body is undefined'
    })
  })

  it('should overwrite existing tag field if present', () => {
    const BadRequestError = tag('bad_request_error')
    const error = BadRequestError({ tag: 'other_tag', message: 'Body is undefined' })
    expect(error).toEqual({
      tag: 'bad_request_error',
      message: 'Body is undefined'
    })
  })
})
