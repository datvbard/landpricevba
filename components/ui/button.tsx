import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'social'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 min-h-[56px] px-6'

  const variantStyles = {
    primary: 'bg-gradient-primary text-white shadow-button hover:shadow-[0_8px_25px_rgba(174,28,62,0.4)] hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-gradient-gold text-white shadow-button hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 active:translate-y-0',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
    social: 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 min-h-[52px]'
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
