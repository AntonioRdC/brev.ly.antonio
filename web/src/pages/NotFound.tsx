import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import NotFoundIconSvg from '../assets/404.svg'

export function NotFound() {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <Card className='w-[580px]'>
        <CardContent className='px-12 py-16 flex flex-col justify-center items-center gap-6'>
          <div className='w-48 h-20 relative overflow-hidden'>
            <img
              src={NotFoundIconSvg}
              alt='404'
              width={192}
              height={84}
              className='text-primary'
            />
          </div>

          <h2 className='self-stretch text-center text-foreground text-2xl font-bold leading-8'>
            Link não encontrado
          </h2>

          <div className='self-stretch flex flex-col justify-start items-center gap-1'>
            <p className='self-stretch text-center text-muted-foreground text-sm font-semibold leading-4'>
              O link que você está tentando acessar não existe, foi removido ou
              é uma URL inválida. Saiba mais em{' '}
              <Link to='/' className='text-primary underline'>
                brev.ly
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
