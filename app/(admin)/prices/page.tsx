'use client'

import { useState, useEffect, useCallback } from 'react'
import type { District, Street } from '@/lib/supabase/database.types'
import { getSegments, updateSegment, deleteSegment, deleteAllPrices, createSegment, formatPrice, type SegmentWithPath, type UpdateSegmentInput, type CreateSegmentInput } from '@/lib/api/admin-prices'

// Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
  </svg>
)

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
  </svg>
)

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  </div>
)

interface EditingCell {
  segmentId: string
  field: keyof UpdateSegmentInput
  value: string
}

export default function PricesPage() {
  const [segments, setSegments] = useState<SegmentWithPath[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [streetId, setStreetId] = useState('')
  const [districts, setDistricts] = useState<District[]>([])
  const [streets, setStreets] = useState<Street[]>([])

  // Editing state
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)

  // Add state
  const [showAddModal, setShowAddModal] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState<CreateSegmentInput>({
    district_name: '',
    street_name: '',
    segment_from: '',
    segment_to: '',
    base_price_min: 0,
    base_price_max: 0,
    government_price: 0,
    adjustment_coef_min: 1,
    adjustment_coef_max: 1,
  })

  // Fetch districts for filter
  useEffect(() => {
    fetch('/api/districts')
      .then(res => res.json())
      .then(data => setDistricts(data))
      .catch(console.error)
  }, [])

  // Fetch streets when district changes
  useEffect(() => {
    if (districtId) {
      fetch(`/api/streets?districtId=${districtId}`)
        .then(res => res.json())
        .then(data => setStreets(data))
        .catch(console.error)
    } else {
      setStreets([])
      setStreetId('')
    }
  }, [districtId])

  // Fetch segments
  const fetchSegments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getSegments({
        search: search || undefined,
        districtId: districtId || undefined,
        streetId: streetId || undefined,
        page,
        pageSize: 20,
      })
      setSegments(result.data)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [search, districtId, streetId, page])

  useEffect(() => {
    fetchSegments()
  }, [fetchSegments])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchSegments()
  }

  // Start editing a cell
  const startEdit = (segment: SegmentWithPath, field: keyof UpdateSegmentInput) => {
    setEditingCell({
      segmentId: segment.id,
      field,
      value: String(segment[field]),
    })
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingCell(null)
  }

  // Save edited value
  const saveEdit = async () => {
    if (!editingCell) return

    try {
      setSaving(true)
      const updateData: UpdateSegmentInput = {
        [editingCell.field]: Number(editingCell.value),
      }
      const updated = await updateSegment(editingCell.segmentId, updateData)

      // Update local state
      setSegments(prev => prev.map(s =>
        s.id === editingCell.segmentId
          ? { ...s, [editingCell.field]: updated[editingCell.field as keyof typeof updated] }
          : s
      ))
      setEditingCell(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể lưu')
    } finally {
      setSaving(false)
    }
  }

  // Delete a segment
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đoạn đường này?')) return

    try {
      setDeleting(id)
      await deleteSegment(id)
      setSegments(prev => prev.filter(s => s.id !== id))
      setTotal(prev => prev - 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa')
    } finally {
      setDeleting(null)
    }
  }

  // Delete all data
  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true)
      await deleteAllPrices()
      setSegments([])
      setTotal(0)
      setShowDeleteAllModal(false)
      setDistricts([])
      setStreets([])
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa')
    } finally {
      setDeletingAll(false)
    }
  }

  // Create new segment
  const handleCreate = async () => {
    if (!addForm.district_name || !addForm.street_name || !addForm.segment_from || !addForm.segment_to) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setAdding(true)
      const newSegment = await createSegment(addForm)
      setSegments(prev => [newSegment, ...prev])
      setTotal(prev => prev + 1)
      setShowAddModal(false)
      setAddForm({
        district_name: '',
        street_name: '',
        segment_from: '',
        segment_to: '',
        base_price_min: 0,
        base_price_max: 0,
        government_price: 0,
        adjustment_coef_min: 1,
        adjustment_coef_max: 1,
      })
      // Refresh districts list
      fetch('/api/districts')
        .then(res => res.json())
        .then(data => setDistricts(data))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể tạo đoạn đường')
    } finally {
      setAdding(false)
    }
  }

  // Render editable cell
  const renderEditableCell = (segment: SegmentWithPath, field: keyof UpdateSegmentInput, value: number) => {
    const isEditing = editingCell?.segmentId === segment.id && editingCell?.field === field

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            className="w-24 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary/20"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
          />
          <button
            onClick={saveEdit}
            disabled={saving}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
          >
            <CheckIcon />
          </button>
          <button
            onClick={cancelEdit}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <XIcon />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <span>{formatPrice(value)}</span>
        <button
          onClick={() => startEdit(segment, field)}
          className="p-1 text-gray-400 hover:text-primary hover:bg-primary/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <EditIcon />
        </button>
      </div>
    )
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Giá Đất</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng {total} đoạn đường</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <PlusIcon />
            Thêm mới
          </button>
          {total > 0 && (
            <button
              onClick={() => setShowDeleteAllModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <TrashIcon />
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm đoạn đường..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* District filter */}
          <select
            value={districtId}
            onChange={(e) => {
              setDistrictId(e.target.value)
              setStreetId('')
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Tất cả địa phương</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Street filter */}
          <select
            value={streetId}
            onChange={(e) => {
              setStreetId(e.target.value)
              setPage(1)
            }}
            disabled={!districtId}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
          >
            <option value="">Tất cả đường</option>
            {streets.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button onClick={fetchSegments} className="px-4 py-2 bg-primary text-white rounded-lg">
            Thử lại
          </button>
        </div>
      ) : segments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-4xl mb-4">📋</div>
          <div className="text-gray-600 font-medium">
            {search || districtId ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu giá đất'}
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vị trí</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Đoạn</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá min (đ/m²)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá max (đ/m²)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá nhà nước</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Hệ số min</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Hệ số max</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {segments.map((segment) => (
                    <tr key={segment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-800">{segment.street.name}</div>
                        <div className="text-xs text-gray-500">{segment.street.district.name}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {segment.segment_from} → {segment.segment_to}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderEditableCell(segment, 'base_price_min', segment.base_price_min)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderEditableCell(segment, 'base_price_max', segment.base_price_max)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderEditableCell(segment, 'government_price', segment.government_price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderEditableCell(segment, 'adjustment_coef_min', segment.adjustment_coef_min)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {renderEditableCell(segment, 'adjustment_coef_max', segment.adjustment_coef_max)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(segment.id)}
                          disabled={deleting === segment.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="Xóa đoạn đường"
                        >
                          {deleting === segment.id ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : (
                            <TrashIcon />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Trang {page} / {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteAllModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa tất cả</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa <strong>TẤT CẢ</strong> dữ liệu giá đất?
              Hành động này không thể hoàn tác và sẽ xóa toàn bộ địa phương, đường và đoạn đường.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                disabled={deletingAll}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingAll ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  'Xóa tất cả'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">Thêm đoạn đường mới</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa phương <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.district_name}
                    onChange={(e) => setAddForm({ ...addForm, district_name: e.target.value })}
                    placeholder="VD: TP. Trà Vinh"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đường <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.street_name}
                    onChange={(e) => setAddForm({ ...addForm, street_name: e.target.value })}
                    placeholder="VD: Nguyễn Thị Minh Khai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Từ đoạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.segment_from}
                    onChange={(e) => setAddForm({ ...addForm, segment_from: e.target.value })}
                    placeholder="VD: Đầu đường"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đến đoạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.segment_to}
                    onChange={(e) => setAddForm({ ...addForm, segment_to: e.target.value })}
                    placeholder="VD: Cuối đường"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá min (đ/m²)</label>
                  <input
                    type="number"
                    value={addForm.base_price_min}
                    onChange={(e) => setAddForm({ ...addForm, base_price_min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá max (đ/m²)</label>
                  <input
                    type="number"
                    value={addForm.base_price_max}
                    onChange={(e) => setAddForm({ ...addForm, base_price_max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhà nước (đ/m²)</label>
                <input
                  type="number"
                  value={addForm.government_price}
                  onChange={(e) => setAddForm({ ...addForm, government_price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hệ số min</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addForm.adjustment_coef_min}
                    onChange={(e) => setAddForm({ ...addForm, adjustment_coef_min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hệ số max</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addForm.adjustment_coef_max}
                    onChange={(e) => setAddForm({ ...addForm, adjustment_coef_max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={adding}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {adding ? 'Đang tạo...' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
