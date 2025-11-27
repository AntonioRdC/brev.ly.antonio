import { ReactNode } from 'react'

interface CenteredLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export function CenteredLayout({
  children,
  className = '',
  maxWidth = 'md',
}: CenteredLayoutProps) {
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      className={`min-h-screen bg-background flex items-center justify-center ${className}`}
    >
      <div className={`w-full px-4 ${widthClasses[maxWidth]}`}>{children}</div>
    </div>
  )
}
