import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import {
  InvalidUrlFormatError,
  ShortCodeAlreadyExistsError,
} from './errors/link-errors'

const createLinkInput = z.object({
  originalUrl: z.string().url(),
  shortCode: z.string().min(1),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<
  Either<
    ShortCodeAlreadyExistsError | InvalidUrlFormatError,
    { id: string; shortCode: string; originalUrl: string }
  >
> {
  const parseResult = createLinkInput.safeParse(input)

  if (!parseResult.success) {
    return makeLeft(new InvalidUrlFormatError())
  }

  const { originalUrl, shortCode } = parseResult.data

  const existingLink = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortCode, shortCode))
    .limit(1)

  if (existingLink.length > 0) {
    return makeLeft(new ShortCodeAlreadyExistsError())
  }

  const [createdLink] = await db
    .insert(schema.links)
    .values({
      originalUrl,
      shortCode,
    })
    .returning({
      id: schema.links.id,
      shortCode: schema.links.shortCode,
      originalUrl: schema.links.originalUrl,
    })

  return makeRight(createdLink)
}
