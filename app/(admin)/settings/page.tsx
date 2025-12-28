'use client'

import { useState, useRef, ChangeEvent } from 'react'

// Icons
const TagIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
  </svg>
)

const ImageIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
)

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
  </svg>
)

const TrashIcon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
  </svg>
)

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
  </svg>
)

const SuccessIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
)

export default function SettingsPage() {
  // Brand name state
  const [bankName, setBankName] = useState('Agribank')
  const [branchName, setBranchName] = useState('Trà Vinh')
  const [slogan, setSlogan] = useState('Tra Cứu Giá Đất')

  // Logo state
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Toast state
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Handle logo upload
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Kích thước file quá lớn! Vui lòng chọn file nhỏ hơn 2MB.')
      return
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      alert('Định dạng file không hợp lệ! Vui lòng chọn file PNG, JPG hoặc SVG.')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Remove logo
  const removeLogo = () => {
    setLogoUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Show toast
  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Save brand name
  const saveBrandName = () => {
    if (!bankName.trim()) {
      alert('Vui lòng nhập tên ngân hàng!')
      return
    }
    showSuccessToast('Đã lưu tên thương hiệu thành công!')
  }

  // Save logo
  const saveLogo = () => {
    if (!logoUrl) {
      alert('Vui lòng chọn logo trước khi lưu!')
      return
    }
    showSuccessToast('Đã lưu logo thành công!')
  }

  // Computed preview name
  const previewName = branchName ? `${bankName} ${branchName}` : bankName

  return (
    <div className="max-w-[900px]">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài Đặt Thương Hiệu</h1>
        <p className="text-base text-gray-600">Quản lý thông tin thương hiệu và logo của hệ thống</p>
      </div>

      {/* Brand Name Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-primary"><TagIcon /></span>
            Tên Thương Hiệu
          </h3>
          <p className="text-sm text-gray-500 mt-1">Cài đặt tên hiển thị của ngân hàng và chi nhánh</p>
        </div>
        <div className="p-6">
          {/* Bank name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên ngân hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-base text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-colors"
              placeholder="Nhập tên ngân hàng..."
            />
            <p className="text-sm text-gray-500 mt-2">Tên này sẽ hiển thị trên tất cả các trang của ứng dụng</p>
          </div>

          {/* Branch name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên chi nhánh
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-base text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-colors"
              placeholder="Nhập tên chi nhánh..."
            />
          </div>

          {/* Slogan */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slogan/Mô tả
            </label>
            <textarea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-base text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-colors resize-y min-h-[120px]"
              placeholder="Nhập slogan hoặc mô tả ngắn..."
            />
            <p className="text-sm text-gray-500 mt-2">Slogan hiển thị kèm theo tên thương hiệu</p>
          </div>
        </div>
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button className="px-6 py-3 bg-transparent text-gray-600 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-100 hover:border-gray-400 transition-colors">
            Hủy
          </button>
          <button
            onClick={saveBrandName}
            className="px-8 py-3 bg-gradient-to-r from-primary to-[#C42D4F] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <CheckIcon />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Logo Upload Card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-primary/5 to-accent/5">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-primary"><ImageIcon /></span>
            Logo Thương Hiệu
          </h3>
          <p className="text-sm text-gray-500 mt-1">Tải lên và quản lý logo của ngân hàng</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Logo preview */}
            <div className="flex-shrink-0">
              <div className={`
                w-40 h-40 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all
                ${logoUrl
                  ? 'bg-white border-2 border-solid border-gray-200'
                  : 'bg-gray-50 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5'
                }
              `}>
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon />
                    <div className="text-sm font-medium mt-2">Chưa có logo</div>
                  </div>
                )}
              </div>
            </div>

            {/* Upload controls */}
            <div className="flex-1">
              {/* Requirements */}
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-lg mb-4">
                <div className="text-sm font-semibold text-gray-800 mb-2">Yêu cầu về logo:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">Định dạng: PNG, JPG, SVG</li>
                  <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">Kích thước tối đa: 2MB</li>
                  <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">Kích thước khuyến nghị: 512x512px</li>
                  <li className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold">Nền trong suốt (PNG) được ưu tiên</li>
                </ul>
              </div>

              {/* File input */}
              <div className="mb-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logoInput"
                />
                <label
                  htmlFor="logoInput"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-[#C42D4F] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <UploadIcon />
                  Chọn file logo
                </label>
              </div>

              {/* Remove button */}
              {logoUrl && (
                <button
                  onClick={removeLogo}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-transparent text-red-500 border-2 border-red-500 rounded-xl font-semibold text-sm hover:bg-red-500 hover:text-white transition-colors"
                >
                  <TrashIcon />
                  Xóa logo
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button className="px-6 py-3 bg-transparent text-gray-600 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-100 hover:border-gray-400 transition-colors">
            Hủy
          </button>
          <button
            onClick={saveLogo}
            className="px-8 py-3 bg-gradient-to-r from-primary to-[#C42D4F] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <CheckIcon />
            Lưu logo
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-6">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-gray-200 rounded-2xl p-6">
          <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-primary"><EyeIcon /></span>
            Xem trước thương hiệu
          </h4>
          <div className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <svg viewBox="0 0 50 50" className="w-10 h-10">
                  <path d="M25 5L40 15V35L25 45L10 35V15L25 5Z" fill="#AE1C3E"/>
                  <path d="M25 12L33 17V27L25 32L17 27V17L25 12Z" fill="#D4AF37"/>
                  <path d="M25 18L29 21V27L25 30L21 27V21L25 18Z" fill="white"/>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-gray-900 mb-1">{previewName || 'Tên thương hiệu'}</div>
              <div className="text-sm text-gray-600">{slogan || 'Slogan'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <div className={`
        fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 z-50
        transition-all duration-300
        ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}
      `}>
        <SuccessIcon />
        <span>{toastMessage}</span>
      </div>
    </div>
  )
}
