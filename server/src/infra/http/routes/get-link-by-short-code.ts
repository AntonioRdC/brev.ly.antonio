import { LinkNotFoundError } from '@/app/functions/errors/link-errors'
import { getLinkByShortCode } from '@/app/functions/get-link-by-short-code'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getLinkByShortCodeRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/api/links/:shortCode',
    {
      schema: {
        tags: ['Links'],
        summary: 'Get link by short code',
        params: z.object({
          shortCode: z.string(),
        }),
        response: {
          200: z.object({
            originalUrl: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params

      try {
        const link = await getLinkByShortCode({ shortCode })

        return reply.status(200).send({
          originalUrl: link.originalUrl,
        })
      } catch (error) {
        if (error instanceof LinkNotFoundError) {
          return reply.status(404).send({
            error: error.message,
          })
        }
        throw error
      }
    }
  )
}