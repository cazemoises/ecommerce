import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ asChild, className, variant = 'primary', size = 'md', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const base = 'inline-flex items-center justify-center rounded-full transition-all disabled:opacity-50 disabled:pointer-events-none'
    const variants = {
      primary: 'bg-black text-white hover:bg-neutral-800',
      secondary: 'border border-neutral-200 hover:bg-neutral-50',
      ghost: 'hover:bg-neutral-100'
    }
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg'
    }
    return (
      <Comp ref={ref as any} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
