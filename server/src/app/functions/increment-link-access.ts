import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { LinkNotFoundError } from './errors/link-errors'

const incrementLinkAccessInput = z.object({
  shortCode: z.string().min(1),
})

type IncrementLinkAccessInput = z.input<typeof incrementLinkAccessInput>

export async function incrementLinkAccess(input: IncrementLinkAccessInput) {
  const { shortCode } = incrementLinkAccessInput.parse(input)

  const [currentLink] = await db
    .select({
      id: schema.links.id,
      accessCount: schema.links.accessCount,
    })
    .from(schema.links)
    .where(eq(schema.links.shortCode, shortCode))
    .limit(1)

  if (!currentLink) {
    throw new LinkNotFoundError()
  }

  const updatedLinks = await db
    .update(schema.links)
    .set({
      accessCount: currentLink.accessCount + 1,
    })
    .where(eq(schema.links.shortCode, shortCode))
    .returning({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortCode: schema.links.shortCode,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })

  return updatedLinks[0]
}
