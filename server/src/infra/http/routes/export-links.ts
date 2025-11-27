import { exportLinks } from '@/app/functions/export-links'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function exportLinksRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/links/export',
    {
      schema: {
        tags: ['Links'],
        summary: 'Export links to CSV',
        response: {
          200: z.object({
            downloadUrl: z.string().url(),
            fileName: z.string(),
          }),
        },
      },
    },
    async () => {
      const result = await exportLinks()
      return result
    }
  )
}
