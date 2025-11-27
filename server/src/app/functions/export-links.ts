import { Readable } from 'node:stream'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { stringify } from 'csv-stringify/sync'
import dayjs from 'dayjs'
import { desc } from 'drizzle-orm'

export async function exportLinks() {
  const links = await db
    .select({
      originalUrl: schema.links.originalUrl,
      shortCode: schema.links.shortCode,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .orderBy(desc(schema.links.createdAt))

  const csvData = stringify(
    links.map(link => ({
      'Original URL': link.originalUrl,
      'Short Code': link.shortCode,
      'Access Count': link.accessCount,
      'Created At': dayjs(link.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    })),
    {
      header: true,
      delimiter: ',',
    }
  )

  const fileName = `links-export-${dayjs().format(
    'YYYY-MM-DD-HH-mm-ss'
  )}-${Math.random().toString(36).substring(2, 15)}.csv`

  const csvStream = Readable.from(csvData)

  const { url } = await uploadFileToStorage({
    folder: 'exports',
    fileName,
    contentType: 'text/csv',
    contentStream: csvStream,
  })

  return { downloadUrl: url, fileName }
}
