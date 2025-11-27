import { beforeEach, describe, expect, it } from 'vitest'
import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { deleteLink } from '../../../app/functions/delete-link'
import { LinkNotFoundError } from '../../../app/functions/errors/link-errors'

describe('deleteLink', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should delete an existing link', async () => {
    const [createdLink] = await db
      .insert(schema.links)
      .values({
        originalUrl: 'https://example.com',
        shortCode: 'delete-test',
      })
      .returning({ 
        id: schema.links.id,
        shortCode: schema.links.shortCode 
      })

    const linksBefore = await db.select().from(schema.links).where(
      eq(schema.links.id, createdLink.id)
    )
    expect(linksBefore).toHaveLength(1)

    const result = await deleteLink({ id: createdLink.id })

    expect(result.id).toBe(createdLink.id)
    expect(result.shortCode).toBe('delete-test')

    const links = await db.select().from(schema.links)
    expect(links).toHaveLength(0)
  })

  it('should throw error when deleting non-existent link', async () => {
    await expect(deleteLink({ id: 'non-existent-id' })).rejects.toThrow(
      LinkNotFoundError
    )
  })
})