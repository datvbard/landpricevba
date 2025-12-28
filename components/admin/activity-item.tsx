interface ActivityItemProps {
  icon: React.ReactNode
  color: 'green' | 'orange' | 'blue'
  text: React.ReactNode
  time: string
}

const colorStyles = {
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-[#FF6B35]',
  blue: 'bg-blue-100 text-blue-500',
}

export default function ActivityItem({ icon, color, text, time }: ActivityItemProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorStyles[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-700 mb-1">{text}</div>
        <div className="text-xs text-gray-400">{time}</div>
      </div>
    </div>
  )
}
