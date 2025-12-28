interface StatCardProps {
  title: string
  value: string | number
  trend?: {
    value: string
    direction: 'up' | 'down'
  }
  icon: React.ReactNode
  color: 'green' | 'orange' | 'teal' | 'blue'
}

const colorStyles = {
  green: {
    bar: 'from-[#00843D] to-[#00A84D]',
    icon: 'from-[#00843D]/10 to-[#00A84D]/10 text-[#00843D]',
  },
  orange: {
    bar: 'from-[#FF6B35] to-[#FFB800]',
    icon: 'from-[#FF6B35]/10 to-[#FFB800]/10 text-[#FF6B35]',
  },
  teal: {
    bar: 'from-[#14B8A6] to-[#0891B2]',
    icon: 'from-[#14B8A6]/10 to-[#0891B2]/10 text-[#0D9488]',
  },
  blue: {
    bar: 'from-[#3B82F6] to-[#6366F1]',
    icon: 'from-[#3B82F6]/10 to-[#6366F1]/10 text-[#3B82F6]',
  },
}

const TrendUpIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
  </svg>
)

const TrendDownIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
  </svg>
)

export default function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const styles = colorStyles[color]

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 relative overflow-hidden">
      {/* Top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.bar}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${styles.icon} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
            ${trend.direction === 'up'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
            }
          `}>
            {trend.direction === 'up' ? <TrendUpIcon /> : <TrendDownIcon />}
            {trend.value}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>

      {/* Label */}
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  )
}
