import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { linkService } from '../services/api'
import { AppLogo } from '@/components/app-logo'
import { LinkForm } from '@/components/link-form'
import { LinkList } from '@/components/link-list'

export function Home() {
  const queryClient = useQueryClient()

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: linkService.getLinks,
  })

  const createLinkMutation = useMutation({
    mutationFn: linkService.createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const deleteLinkMutation = useMutation({
    mutationFn: linkService.deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const exportLinksMutation = useMutation({
    mutationFn: linkService.exportLinks,
    onSuccess: csvUrl => {
      const link = document.createElement('a')
      link.href = csvUrl
      link.download = 'links-report.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  })

  const handleCreateLink = (data: {
    originalUrl: string
    shortCode?: string
  }) => {
    createLinkMutation.mutate(data)
  }

  const handleDeleteLink = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este link?')) {
      deleteLinkMutation.mutate(id)
    }
  }

  const handleExportLinks = () => {
    exportLinksMutation.mutate()
  }

  return (
    <div className='min-h-screen bg-background py-12'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex justify-center lg:justify-start mb-8'>
          <AppLogo />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          <LinkForm
            onSubmit={handleCreateLink}
            isLoading={createLinkMutation.isPending}
          />

          <LinkList
            links={links}
            isLoading={isLoading}
            onDelete={handleDeleteLink}
            onExport={handleExportLinks}
            isDeleting={deleteLinkMutation.isPending}
            isExporting={exportLinksMutation.isPending}
          />
        </div>
      </div>
    </div>
  )
}
