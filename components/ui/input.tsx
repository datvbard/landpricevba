import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  rightElement?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-400 pointer-events-none transition-colors">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full min-h-[56px] px-4 font-sans text-base text-gray-800 bg-gray-50
            border-2 border-transparent rounded-xl transition-all duration-150
            focus:outline-none focus:bg-white focus:border-primary focus:shadow-[0_0_0_4px_rgba(174,28,62,0.1)]
            placeholder:text-gray-400
            ${icon ? 'pl-12' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
