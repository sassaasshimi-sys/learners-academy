'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string
  variant?: 'default' | 'light' | 'dark'
}

const sizeMap = {
  sm: { image: 32, text: 'text-lg' },
  md: { image: 48, text: 'text-xl' },
  lg: { image: 64, text: 'text-2xl' },
  xl: { image: 80, text: 'text-3xl' },
}

export function Logo({ 
  className, 
  showText = true, 
  size = 'md',
  href = '/',
  variant = 'default'
}: LogoProps) {
  const { image: imageSize, text: textSize } = sizeMap[size]
  
  const textColorClass = variant === 'light' 
    ? 'text-white' 
    : variant === 'dark' 
      ? 'text-foreground' 
      : 'text-foreground'

  const content = (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex-shrink-0">
        <Image
          src="/images/logo.png"
          alt="The Learners Academy Logo"
          width={imageSize}
          height={imageSize}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className={cn('flex flex-col leading-none', textColorClass)}>
          <span className={cn('font-serif font-semibold tracking-tight', textSize)}>
            The Learners
          </span>
          <span className={cn('font-serif font-medium tracking-wide opacity-80', 
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'
          )}>
            Academy
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    )
  }

  return content
}
