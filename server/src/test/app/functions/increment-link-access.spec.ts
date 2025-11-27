import { beforeEach, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { incrementLinkAccess } from '../../../app/functions/increment-link-access'
import { LinkNotFoundError } from '../../../app/functions/errors/link-errors'

describe('incrementLinkAccess', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should increment access count for existing link', async () => {
    const [insertedLink] = await db.insert(schema.links).values({
      originalUrl: 'https://example.com',
      shortCode: 'increment-test-unique',
      accessCount: 5,
    }).returning({ 
      id: schema.links.id, 
      shortCode: schema.links.shortCode 
    })

    const linksBefore = await db.select().from(schema.links).where(
      eq(schema.links.shortCode, insertedLink.shortCode)
    )
    expect(linksBefore).toHaveLength(1)
    expect(linksBefore[0].accessCount).toBe(5)

    const result = await incrementLinkAccess({ shortCode: insertedLink.shortCode })

    expect(result).toBeDefined()
    expect(result.shortCode).toBe('increment-test-unique')
    expect(result.originalUrl).toBe('https://example.com')
    expect(result.accessCount).toBe(6)
  })

  it('should increment from zero', async () => {
    const [insertedLink] = await db.insert(schema.links).values({
      originalUrl: 'https://example.com',
      shortCode: 'zero-test-unique',
      accessCount: 0,
    }).returning({ 
      id: schema.links.id, 
      shortCode: schema.links.shortCode 
    })

    const linksBefore = await db.select().from(schema.links).where(
      eq(schema.links.shortCode, insertedLink.shortCode)
    )
    expect(linksBefore).toHaveLength(1)
    expect(linksBefore[0].accessCount).toBe(0)

    const result = await incrementLinkAccess({ shortCode: insertedLink.shortCode })

    expect(result).toBeDefined()
    expect(result.accessCount).toBe(1)
  })

  it('should throw error for non-existent link', async () => {
    await expect(
      incrementLinkAccess({ shortCode: 'non-existent' })
    ).rejects.toThrow(LinkNotFoundError)
  })
})