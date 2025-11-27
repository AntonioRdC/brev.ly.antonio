import { deleteLink } from '@/app/functions/delete-link'
import { LinkNotFoundError } from '@/app/functions/errors/link-errors'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function deleteLinkRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/links/:id',
    {
      schema: {
        tags: ['Links'],
        summary: 'Delete a link',
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            shortCode: z.string(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const deletedLink = await deleteLink({ id })
        return reply.status(200).send(deletedLink)
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
