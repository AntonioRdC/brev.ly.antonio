import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { exportLinks } from '../../../app/functions/export-links'

vi.mock('@/infra/storage/upload-file-to-storage', () => ({
  uploadFileToStorage: vi.fn().mockResolvedValue({
    url: 'https://example.com/test-file.csv',
  }),
}))

describe('exportLinks', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should export links to CSV', async () => {
    await db.insert(schema.links).values([
      {
        originalUrl: 'https://first.com',
        shortCode: 'export-first',
        accessCount: 10,
      },
      {
        originalUrl: 'https://second.com',
        shortCode: 'export-second',
        accessCount: 5,
      },
    ])

    const result = await exportLinks()

    expect(result.downloadUrl).toBe('https://example.com/test-file.csv')
    expect(result.fileName).toMatch(/^links-export-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\w+\.csv$/)
  })

  it('should handle empty links list', async () => {
    const result = await exportLinks()

    expect(result.downloadUrl).toBe('https://example.com/test-file.csv')
    expect(result.fileName).toMatch(/\.csv$/)
  })
})