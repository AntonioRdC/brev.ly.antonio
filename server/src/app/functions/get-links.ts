import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { desc } from 'drizzle-orm'

export async function getLinks() {
  const links = await db
    .select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortCode: schema.links.shortCode,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))

  return links
}
