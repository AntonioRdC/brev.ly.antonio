import { getLinks } from '@/app/functions/get-links'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function getLinksRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/links',
    {
      schema: {
        tags: ['Links'],
        summary: 'Get all links',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              originalUrl: z.string(),
              shortCode: z.string(),
              accessCount: z.number(),
              createdAt: z.date(),
            })
          ),
        },
      },
    },
    async () => {
      const links = await getLinks()
      return links
    }
  )
}
