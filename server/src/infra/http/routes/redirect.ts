import { LinkNotFoundError } from '@/app/functions/errors/link-errors'
import { getLinkByShortCode } from '@/app/functions/get-link-by-short-code'
import { incrementLinkAccess } from '@/app/functions/increment-link-access'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function redirectRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:shortCode',
    {
      schema: {
        tags: ['Redirect'],
        summary: 'Redirect to original URL',
        params: z.object({
          shortCode: z.string(),
        }),
        response: {
          302: z.void(),
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

        await incrementLinkAccess({ shortCode })

        return reply.redirect(link.originalUrl, 302)
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
