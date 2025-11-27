import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import TrashIconSvg from '../assets/Trash.svg'
import LinkIconSvg from '../assets/Link.svg'
import CopyIconSvg from '../assets/Copy.svg'
import VectorSvg from '../assets/Vector.svg'

interface Link {
  id: string
  shortCode: string
  originalUrl: string
  accessCount: number
}

interface LinkListProps {
  links: Link[]
  isLoading?: boolean
  onDelete: (id: string) => void
  onExport: () => void
  isDeleting?: boolean
  isExporting?: boolean
}

export function LinkList({
  links,
  isLoading,
  onDelete,
  onExport,
  isDeleting,
  isExporting,
}: LinkListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className='text-center py-12 space-y-4'>
        <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto'>
          <img
            src={LinkIconSvg}
            alt='Link'
            width={32}
            height={32}
            className='text-muted-foreground'
          />
        </div>
        <p className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
          Ainda não existem links cadastrados
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className='pb-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-bold'>Meus links</h2>
          <Button
            variant='outline'
            size='sm'
            onClick={onExport}
            disabled={isExporting || links.length === 0}
            className='flex items-center gap-2'
          >
            <img src={VectorSvg} alt='Download' width={16} height={16} />
            Baixar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-0'>
        {/* Links list */}
        <div className='space-y-3'>
          {links.map((link, index) => (
            <div key={link.id}>
              <div className='flex items-center justify-between py-2'>
                <div className='flex-1 min-w-0 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold text-primary'>
                      brev.ly/{link.shortCode}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground truncate'>
                    {link.originalUrl}
                  </p>
                </div>

                <div className='flex items-center gap-3 ml-4'>
                  <Badge variant='secondary' className='text-xs'>
                    {link.accessCount} acessos
                  </Badge>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0'
                    onClick={() =>
                      handleCopy(
                        `${window.location.origin}/${link.shortCode}`,
                        link.id
                      )
                    }
                  >
                    {copiedId === link.id ? (
                      <span className='text-xs'>✓</span>
                    ) : (
                      <img
                        src={CopyIconSvg}
                        alt='Copy'
                        width={12}
                        height={12}
                      />
                    )}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onDelete(link.id)}
                    disabled={isDeleting}
                    className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                  >
                    <img
                      src={TrashIconSvg}
                      alt='Delete'
                      width={12}
                      height={12}
                    />
                  </Button>
                </div>
              </div>
              {index < links.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
