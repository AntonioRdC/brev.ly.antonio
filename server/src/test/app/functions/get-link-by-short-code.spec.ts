import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { beforeEach, describe, expect, it } from 'vitest'
import { LinkNotFoundError } from '../../../app/functions/errors/link-errors'
import { getLinkByShortCode } from '../../../app/functions/get-link-by-short-code'

describe('getLinkByShortCode', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should return link when short code exists', async () => {
    const linkData = {
      originalUrl: 'https://example.com',
      shortCode: 'unique123',
      accessCount: 5,
    }

    await db.insert(schema.links).values(linkData)

    const insertedLinks = await db.select().from(schema.links).where(
      eq(schema.links.shortCode, 'unique123')
    )
    expect(insertedLinks).toHaveLength(1)

    const result = await getLinkByShortCode({ shortCode: 'unique123' })

    expect(result.originalUrl).toBe(linkData.originalUrl)
    expect(result.shortCode).toBe(linkData.shortCode)
    expect(result.accessCount).toBe(linkData.accessCount)
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeDefined()
  })

  it('should throw error when short code does not exist', async () => {
    await expect(
      getLinkByShortCode({ shortCode: 'nonexistent' })
    ).rejects.toThrow(LinkNotFoundError)
  })
})
