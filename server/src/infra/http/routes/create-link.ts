import { createLink } from '@/app/functions/create-link'
import {
  InvalidUrlFormatError,
  ShortCodeAlreadyExistsError,
} from '@/app/functions/errors/link-errors'
import { isLeft } from '@/infra/shared/either'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createLinkRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/links',
    {
      schema: {
        tags: ['Links'],
        summary: 'Create a shortened link',
        body: z.object({
          originalUrl: z.string().url(),
          shortCode: z.string().min(1).max(50),
        }),
        response: {
          201: z.object({
            id: z.string(),
            shortCode: z.string(),
            originalUrl: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortCode } = request.body

      const result = await createLink({ originalUrl, shortCode })

      if (isLeft(result)) {
        const error = result.left

        if (error instanceof ShortCodeAlreadyExistsError) {
          return reply.status(409).send({
            error: error.message,
          })
        }

        if (error instanceof InvalidUrlFormatError) {
          return reply.status(400).send({
            error: error.message,
          })
        }
      }

      const link = result.right

      return reply.status(201).send(link)
    }
  )
}
