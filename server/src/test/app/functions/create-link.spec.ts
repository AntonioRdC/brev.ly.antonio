import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/infra/shared/either'
import { beforeEach, describe, expect, it } from 'vitest'
import { createLink } from '../../../app/functions/create-link'
import {
  InvalidUrlFormatError,
  ShortCodeAlreadyExistsError,
} from '../../../app/functions/errors/link-errors'

describe('createLink', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should create a link with valid input', async () => {
    const input = {
      originalUrl: 'https://example.com',
      shortCode: 'abc123',
    }

    const result = await createLink(input)

    expect(isRight(result)).toBe(true)
    if (isRight(result)) {
      expect(result.right.originalUrl).toBe(input.originalUrl)
      expect(result.right.shortCode).toBe(input.shortCode)
      expect(result.right.id).toBeDefined()
    }
  })

  it('should return error for invalid URL', async () => {
    const input = {
      originalUrl: 'invalid-url',
      shortCode: 'abc123',
    }

    const result = await createLink(input)

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(InvalidUrlFormatError)
    }
  })

  it('should return error for duplicate short code', async () => {
    const input = {
      originalUrl: 'https://example.com',
      shortCode: 'unique-duplicate-2',
    }

    const firstResult = await createLink(input)
    expect(isRight(firstResult)).toBe(true)
    
    const result = await createLink(input)

    expect(isLeft(result)).toBe(true)
    if (isLeft(result)) {
      expect(result.left).toBeInstanceOf(ShortCodeAlreadyExistsError)
    }
  })
})
