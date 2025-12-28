'use client'

import StatCard from '@/components/admin/stat-card'
import DataTable, { TableActions } from '@/components/admin/data-table'
import ActivityItem from '@/components/admin/activity-item'
import { statsData, pricesData, activityData } from '@/lib/mock-data/admin-data'

// Icons for stats
const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
  </svg>
)

const CalculatorIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
  </svg>
)

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
)

// Activity icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>
)

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
  </svg>
)

const statIcons = [LocationIcon, CalculatorIcon, UsersIcon, SearchIcon]

const activityIcons: Record<string, React.FC> = {
  add: PlusIcon,
  edit: EditIcon,
  user: UserIcon,
  system: CheckIcon,
  import: UploadIcon,
}

// Table columns
const columns = [
  { key: 'stt', header: 'STT', className: 'w-[50px] text-center font-medium text-gray-500' },
  { key: 'district', header: 'Quận/Huyện', className: 'font-medium text-gray-700' },
  { key: 'street', header: 'Tên đường', className: 'font-semibold text-gray-800' },
  { key: 'segmentFrom', header: 'Đoạn (Từ)', className: 'text-gray-600 text-xs max-w-[150px] truncate' },
  { key: 'segmentTo', header: 'Đoạn (Đến)', className: 'text-gray-600 text-xs max-w-[150px] truncate' },
  { key: 'priceUbnd', header: 'Giá UBND', className: 'text-right font-semibold text-gray-600' },
  { key: 'priceLow', header: 'Giá thấp', className: 'text-right font-semibold text-cyan-600' },
  { key: 'priceHigh', header: 'Giá cao', className: 'text-right font-semibold text-[#FF6B35]' },
  { key: 'priceAvg', header: 'Giá TB', className: 'text-right font-bold text-[#00843D]' },
  {
    key: 'actions',
    header: 'Thao tác',
    render: () => <TableActions />,
  },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Page title */}
      <h1 className="text-xl font-bold text-gray-800 mb-6">Tổng Quan</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {statsData.map((stat, idx) => {
          const Icon = statIcons[idx]
          return (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={<Icon />}
              color={stat.color}
            />
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Table - 2/3 width */}
        <div className="xl:col-span-2">
          <DataTable
            title="Giá Đất Mới Cập Nhật"
            columns={columns}
            data={pricesData}
          />
        </div>

        {/* Activity - 1/3 width */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Hoạt động gần đây</h2>
          </div>
          <div className="p-4">
            {activityData.map((activity, idx) => {
              const Icon = activityIcons[activity.type]
              return (
                <ActivityItem
                  key={idx}
                  icon={<Icon />}
                  color={activity.color}
                  text={
                    <>
                      <strong className="font-semibold text-gray-800">{activity.user}</strong>{' '}
                      {activity.action}
                    </>
                  }
                  time={activity.time}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
