'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
)

const MoreIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
  </svg>
)

const LocationIcon = () => (
  <svg className="w-[26px] h-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
)

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

// Mock history data
const historyData = [
  {
    id: 1,
    street: 'Duong Nguyen Thi Minh Khai',
    district: 'TP. Tra Vinh - Doan 1',
    price: '1.665 ty',
    date: '10:30 - Hom nay',
    landType: 'Tho cu',
    position: 'Mat tien',
    area: '100m2',
    gradient: 'bg-gradient-primary',
  },
  {
    id: 2,
    street: 'Duong Ly Thuong Kiet',
    district: 'TP. Tra Vinh - Toan tuyen',
    price: '2.450 ty',
    date: '14:20 - Hom qua',
    landType: 'TMDV',
    position: 'Mat tien',
    area: '150m2',
    gradient: 'bg-gradient-gold',
  },
  {
    id: 3,
    street: 'Duong Tran Phu',
    district: 'Huyen Cang Long - Doan 2',
    price: '856 trieu',
    date: '09:15 - 25/12',
    landType: 'Tho cu',
    position: 'Hem 1',
    area: '80m2',
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  },
  {
    id: 4,
    street: 'Duong Hung Vuong',
    district: 'Huyen Cau Ke - Toan tuyen',
    price: '1.2 ty',
    date: '16:45 - 24/12',
    landType: 'SXKD',
    position: 'Mat tien',
    area: '200m2',
    gradient: 'bg-gradient-primary',
  },
  {
    id: 5,
    street: 'Duong Pham Ngu Lao',
    district: 'TP. Tra Vinh - Doan 1',
    price: '1.85 ty',
    date: '11:20 - 22/12',
    landType: 'Tho cu',
    position: 'Hem 2',
    area: '120m2',
    gradient: 'bg-gradient-gold',
  },
]

const filterTabs = ['Tat ca', 'Hom nay', '7 ngay qua', '30 ngay qua', 'Da luu']

export default function HistoryPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('Tat ca')

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    alert('Da sao chep lien ket vao clipboard!')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Ban co chac muon xoa muc nay?')) {
      alert('Da xoa thanh cong!')
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-vibrant px-5 py-4 pt-[calc(1rem+env(safe-area-inset-top))] sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 bg-white/15 border-none rounded-lg text-white flex items-center justify-center cursor-pointer transition-all hover:bg-white/25 flex-shrink-0"
            >
              <BackIcon />
            </button>
            <div className="text-white">
              <div className="text-lg font-bold">Lich Su Tra Cuu</div>
              <div className="text-sm opacity-90">Cac tim kiem gan day</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/15 border-none rounded-lg text-white flex items-center justify-center cursor-pointer transition-all hover:bg-white/25">
              <SearchIcon />
            </button>
            <button className="w-10 h-10 bg-white/15 border-none rounded-lg text-white flex items-center justify-center cursor-pointer transition-all hover:bg-white/25">
              <MoreIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Summary */}
      <section className="bg-gradient-vibrant px-5 pb-6 -mt-px">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur-[10px] rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold mb-1">24</div>
            <div className="text-xs opacity-90">Luot tra cuu</div>
          </div>
          <div className="bg-white/15 backdrop-blur-[10px] rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold mb-1">8</div>
            <div className="text-xs opacity-90">Quan/Huyen</div>
          </div>
          <div className="bg-white/15 backdrop-blur-[10px] rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold mb-1">15</div>
            <div className="text-xs opacity-90">Da luu</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-5 py-5 pb-[calc(6rem+env(safe-area-inset-bottom))] -mt-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 py-2 px-4 border-2 rounded-full text-sm font-medium cursor-pointer transition-all whitespace-nowrap ${
                activeFilter === tab
                  ? 'bg-gradient-primary border-transparent text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-primary-light hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="flex flex-col gap-3">
          {historyData.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => router.push('/results')}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all cursor-pointer animate-fadeInUp hover:shadow-md hover:translate-x-1"
              style={{ animationDelay: `${0.05 * idx}s` }}
            >
              <div className="flex items-center p-4 gap-4">
                <div className={`w-[52px] h-[52px] ${item.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white"><LocationIcon /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-gray-800 mb-1 truncate">{item.street}</div>
                  <div className="text-sm text-gray-500 truncate">{item.district}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-bold text-primary mb-1">{item.price}</div>
                  <div className="text-xs text-gray-400">{item.date}</div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2">
                  <span className="py-1 px-2 bg-primary/10 border border-primary/20 rounded text-xs text-primary">{item.landType}</span>
                  <span className="py-1 px-2 bg-white border border-gray-200 rounded text-xs text-gray-600">{item.position}</span>
                  <span className="py-1 px-2 bg-white border border-gray-200 rounded text-xs text-gray-600">{item.area}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleShare}
                    className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center cursor-pointer transition-all text-gray-500 hover:border-primary hover:text-primary"
                  >
                    <ShareIcon />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center cursor-pointer transition-all text-gray-500 hover:border-red-500 hover:text-red-500"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
