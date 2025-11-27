import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { getLinks } from '../../../app/functions/get-links'

describe('getLinks', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should return empty array when no links exist', async () => {
    const result = await getLinks()
    expect(result).toEqual([])
  })

  it('should return all links ordered by creation date desc', async () => {
    const existingLinks = await db.select().from(schema.links)
    expect(existingLinks).toHaveLength(0)
    
    const firstInsert = await db.insert(schema.links).values({
      originalUrl: 'https://first.com',
      shortCode: 'list-first-unique',
    }).returning({ createdAt: schema.links.createdAt })
    
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const secondInsert = await db.insert(schema.links).values({
      originalUrl: 'https://second.com',
      shortCode: 'list-second-unique',
    }).returning({ createdAt: schema.links.createdAt })

    const result = await getLinks()

    expect(result).toHaveLength(2)
    
    expect(result[0].shortCode).toBe('list-second-unique')
    expect(result[1].shortCode).toBe('list-first-unique')
  })
})