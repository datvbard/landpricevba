import { SelectHTMLAttributes, ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  icon?: ReactNode
  options: { value: string; label: string }[]
  placeholder?: string
}

export default function Select({
  label,
  icon,
  options,
  placeholder = 'Chon...',
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10">
            {icon}
          </span>
        )}
        <select
          className={`w-full py-4 px-4 ${icon ? 'pl-12' : ''} pr-10 font-sans text-base text-gray-800 bg-white border-2 border-gray-200 rounded-xl appearance-none cursor-pointer transition-all duration-150 min-h-[56px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Dropdown arrow */}
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  )
}
