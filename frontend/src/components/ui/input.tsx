import * as React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn('flex h-10 w-full bg-white px-3 py-2 text-sm placeholder:text-neutral-400 border-b border-neutral-200 focus:outline-none focus:border-neutral-800', className)}
      {...props}
    />
  )
})
Input.displayName = 'Input'
