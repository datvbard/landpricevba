'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Select from '@/components/ui/select'
import type { District, Street, Segment } from '@/lib/supabase/database.types'

// Icons
const BellIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
  </svg>
)

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
  </svg>
)

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
)

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
  </svg>
)

const DocIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>
)

const HelpIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

const LightningIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
  </svg>
)

const LoadingSpinner = () => (
  <svg className="animate-spin w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
)

export default function HomePage() {
  const router = useRouter()

  // Data state
  const [districts, setDistricts] = useState<District[]>([])
  const [streets, setStreets] = useState<Street[]>([])
  const [segments, setSegments] = useState<Segment[]>([])

  // Selection state
  const [districtId, setDistrictId] = useState('')
  const [streetId, setStreetId] = useState('')
  const [segmentId, setSegmentId] = useState('')

  // Loading state
  const [loadingDistricts, setLoadingDistricts] = useState(true)
  const [loadingStreets, setLoadingStreets] = useState(false)
  const [loadingSegments, setLoadingSegments] = useState(false)

  // Fetch districts on mount
  useEffect(() => {
    async function fetchDistricts() {
      try {
        const res = await fetch('/api/districts')
        const data = await res.json()
        setDistricts(data)
      } catch (error) {
        console.error('Error fetching districts:', error)
      } finally {
        setLoadingDistricts(false)
      }
    }
    fetchDistricts()
  }, [])

  // Fetch streets when district changes
  useEffect(() => {
    if (!districtId) {
      setStreets([])
      setStreetId('')
      setSegments([])
      setSegmentId('')
      return
    }

    async function fetchStreets() {
      setLoadingStreets(true)
      try {
        const res = await fetch(`/api/streets?districtId=${districtId}`)
        const data = await res.json()
        setStreets(data)
        setStreetId('')
        setSegments([])
        setSegmentId('')
      } catch (error) {
        console.error('Error fetching streets:', error)
      } finally {
        setLoadingStreets(false)
      }
    }
    fetchStreets()
  }, [districtId])

  // Fetch segments when street changes
  useEffect(() => {
    if (!streetId) {
      setSegments([])
      setSegmentId('')
      return
    }

    async function fetchSegments() {
      setLoadingSegments(true)
      try {
        const res = await fetch(`/api/segments?streetId=${streetId}`)
        const data = await res.json()
        setSegments(data)
        setSegmentId('')
      } catch (error) {
        console.error('Error fetching segments:', error)
      } finally {
        setLoadingSegments(false)
      }
    }
    fetchSegments()
  }, [streetId])

  const handleSearch = () => {
    if (!districtId) {
      alert('Vui lòng chọn Quận/Huyện')
      return
    }
    if (!streetId) {
      alert('Vui lòng chọn Đường')
      return
    }
    if (!segmentId) {
      alert('Vui lòng chọn Đoạn đường')
      return
    }

    // Navigate to results with segment ID
    router.push(`/results?segmentId=${segmentId}`)
  }

  // Convert data to select options
  const districtOptions = districts.map(d => ({ value: d.id, label: d.name }))
  const streetOptions = streets.map(s => ({ value: s.id, label: s.name }))
  const segmentOptions = segments.map(s => ({
    value: s.id,
    label: `Từ ${s.segment_from} đến ${s.segment_to}`
  }))

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-vibrant px-5 py-4 pt-[calc(1rem+env(safe-area-inset-top))] sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 50 50" className="w-7 h-7" fill="none">
                <path d="M25 5L40 15V35L25 45L10 35V15L25 5Z" fill="#AE1C3E"/>
                <path d="M25 12L33 17V27L25 32L17 27V17L25 12Z" fill="#D4AF37"/>
                <path d="M25 18L29 21V27L25 30L21 27V21L25 18Z" fill="white"/>
              </svg>
            </div>
            <div className="text-white">
              <div className="text-base font-bold">AGRIBANK TRÀ VINH</div>
              <div className="text-xs opacity-90">Tra Cứu Giá Đất</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 bg-white/15 border-none rounded-lg text-white flex items-center justify-center cursor-pointer transition-all hover:bg-white/25">
              <BellIcon />
            </button>
            <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gradient-gold flex items-center justify-center text-white font-bold text-sm">
              NV
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="bg-gradient-vibrant px-5 pb-6 -mt-px">
        <div className="bg-white/15 backdrop-blur-[10px] rounded-2xl p-5 text-white">
          <div className="text-lg font-semibold mb-1">Xin chào!</div>
          <div className="text-sm opacity-90">Tra cứu giá đất nhanh chóng và chính xác</div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">{districts.length || 9}</div>
              <div className="text-xs opacity-80 mt-1">Quận/Huyện</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">250+</div>
              <div className="text-xs opacity-80 mt-1">Tuyến đường</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-xl font-bold">2024</div>
              <div className="text-xs opacity-80 mt-1">Cập nhật</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 px-5 py-5 pb-[calc(6rem+env(safe-area-inset-bottom))] -mt-4">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp">
          <div className="bg-gradient-to-r from-primary/5 to-primary-light/5 px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-primary"><SearchIcon /></span>
              Tra Cứu Giá Đất
            </h2>
          </div>
          <div className="p-5">
            {/* Step 1: Location Selection */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-800">Chọn vị trí</div>
                  <div className="text-sm text-gray-500">Chọn quận/huyện, đường và đoạn đường</div>
                </div>
              </div>

              {/* District Select */}
              <div className="relative">
                <Select
                  label="Quận/Huyện"
                  icon={loadingDistricts ? <LoadingSpinner /> : <BuildingIcon />}
                  options={districtOptions}
                  placeholder={loadingDistricts ? 'Đang tải...' : 'Chọn Quận/Huyện'}
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  disabled={loadingDistricts}
                />
              </div>

              {/* Street Select */}
              <div className="relative">
                <Select
                  label="Đường"
                  icon={loadingStreets ? <LoadingSpinner /> : <MapIcon />}
                  options={streetOptions}
                  placeholder={loadingStreets ? 'Đang tải...' : districtId ? 'Chọn Đường' : 'Chọn Quận/Huyện trước'}
                  value={streetId}
                  onChange={(e) => setStreetId(e.target.value)}
                  disabled={!districtId || loadingStreets}
                />
              </div>

              {/* Segment Select */}
              <div className="relative">
                <Select
                  label="Đoạn đường (Từ - Đến)"
                  icon={loadingSegments ? <LoadingSpinner /> : <LocationIcon />}
                  options={segmentOptions}
                  placeholder={loadingSegments ? 'Đang tải...' : streetId ? 'Chọn Đoạn đường' : 'Chọn Đường trước'}
                  value={segmentId}
                  onChange={(e) => setSegmentId(e.target.value)}
                  disabled={!streetId || loadingSegments}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!districtId || !streetId || !segmentId}
              className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-primary border-none rounded-xl cursor-pointer transition-all min-h-[60px] shadow-button flex items-center justify-center gap-3 mt-6 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(174,28,62,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-button"
            >
              <SearchIcon />
              TRA CỨU
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-primary"><LightningIcon /></span>
            Truy cập nhanh
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/history" className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer transition-all border-2 border-transparent hover:shadow-md hover:border-primary-light hover:-translate-y-0.5 no-underline">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-primary/10 to-primary-light/10 text-primary">
                <ClockIcon />
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-1">Lịch sử</div>
              <div className="text-xs text-gray-500">Xem tra cứu gần đây</div>
            </Link>
            <Link href="#" className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer transition-all border-2 border-transparent hover:shadow-md hover:border-accent hover:-translate-y-0.5 no-underline">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-accent/10 to-accent/20 text-accent">
                <ChartIcon />
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-1">Thống kê</div>
              <div className="text-xs text-gray-500">Biểu đồ giá đất</div>
            </Link>
            <Link href="#" className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer transition-all border-2 border-transparent hover:shadow-md hover:border-teal-400 hover:-translate-y-0.5 no-underline">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-teal-500/10 to-cyan-600/10 text-teal-600">
                <DocIcon />
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-1">Văn bản</div>
              <div className="text-xs text-gray-500">QĐ UBND tỉnh</div>
            </Link>
            <Link href="#" className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer transition-all border-2 border-transparent hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 no-underline">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-500">
                <HelpIcon />
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-1">Hướng dẫn</div>
              <div className="text-xs text-gray-500">Cách sử dụng</div>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
