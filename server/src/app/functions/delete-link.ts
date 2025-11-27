import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { LinkNotFoundError } from './errors/link-errors'

const deleteLinkInput = z.object({
  id: z.string().min(1),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(input: DeleteLinkInput) {
  const { id } = deleteLinkInput.parse(input)

  const [deletedLink] = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning({
      id: schema.links.id,
      shortCode: schema.links.shortCode,
    })

  if (!deletedLink) {
    throw new LinkNotFoundError()
  }

  return deletedLink
}
