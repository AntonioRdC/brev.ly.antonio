import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { LinkNotFoundError } from './errors/link-errors'

const getLinkByShortCodeInput = z.object({
  shortCode: z.string().min(1),
})

type GetLinkByShortCodeInput = z.input<typeof getLinkByShortCodeInput>

export async function getLinkByShortCode(input: GetLinkByShortCodeInput) {
  const { shortCode } = getLinkByShortCodeInput.parse(input)

  const [link] = await db
    .select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      shortCode: schema.links.shortCode,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .where(eq(schema.links.shortCode, shortCode))
    .limit(1)

  if (!link) {
    throw new LinkNotFoundError()
  }

  return link
}
