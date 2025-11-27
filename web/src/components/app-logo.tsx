import LogoIconSvg from '../assets/Logo_Icon.svg'
import { cn } from '@/lib/utils'

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export function AppLogo({
  size = 'md',
  showIcon = true,
  className,
}: AppLogoProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {showIcon && (
        <img
          src={LogoIconSvg}
          alt='Brev.ly logo'
          width={iconSizes[size]}
          height={iconSizes[size]}
          className='text-primary'
        />
      )}
      <h1
        className={cn(
          'font-bold text-primary font-quicksand',
          sizeClasses[size]
        )}
      >
        brev.ly
      </h1>
    </div>
  )
}
