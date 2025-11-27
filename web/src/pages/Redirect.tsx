import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { linkService } from '../services/api'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent } from '@/components/ui/card'

export function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const [redirecting, setRedirecting] = useState(false)

  const {
    data: link,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['link', shortCode],
    queryFn: () => linkService.getLinkByShortCode(shortCode!),
    enabled: !!shortCode,
    retry: false,
  })

  useEffect(() => {
    if (link?.originalUrl && !redirecting) {
      setRedirecting(true)
      setTimeout(() => {
        window.location.href = link.originalUrl
      }, 1500)
    }
  }, [link, redirecting])

  if (error || (!isLoading && !link)) {
    return <Navigate to='/404' replace />
  }

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <Card className='w-[580px]'>
        <CardContent className='px-12 py-16 flex flex-col justify-center items-center gap-6'>
          <div className='size-12 relative'>
            <LoadingSpinner size='lg' />
          </div>

          <h2 className='self-stretch text-center text-foreground text-2xl font-bold leading-8'>
            Redirecionando...
          </h2>

          <div className='self-stretch flex flex-col justify-start items-center gap-1'>
            <p className='self-stretch text-center text-muted-foreground text-sm font-semibold leading-4'>
              O link será aberto automaticamente em alguns instantes.
            </p>
            <p className='self-stretch text-center text-muted-foreground text-sm font-semibold leading-4'>
              Não foi redirecionado?{' '}
              {link?.originalUrl && (
                <a
                  href={link.originalUrl}
                  className='text-primary underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Acesse aqui
                </a>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
