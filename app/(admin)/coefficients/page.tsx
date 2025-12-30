'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CoefficientType as CoefficientTypeRow } from '@/lib/supabase/database.types'
import {
  getCoefficientTypes,
  getCoefficientValues,
  createCoefficientType,
  updateCoefficientType,
  deleteCoefficientType,
  createCoefficientValue,
  updateCoefficientValue,
  deleteCoefficientValue,
  deleteAllCoefficientValues,
  formatCoefficient,
  type CoefficientValueWithType,
  type CreateCoefficientTypeInput,
  type CreateCoefficientValueInput,
} from '@/lib/api/admin-dynamic-coefficients'

// Icons
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

const CogIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
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

export default function CoefficientsPage() {
  // Coefficient types state
  const [coefficientTypes, setCoefficientTypes] = useState<CoefficientTypeRow[]>([])
  const [activeType, setActiveType] = useState<CoefficientTypeRow | null>(null)
  const [typesLoading, setTypesLoading] = useState(true)

  // Coefficient values state
  const [values, setValues] = useState<CoefficientValueWithType[]>([])
  const [valuesLoading, setValuesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit value modal
  const [editingValue, setEditingValue] = useState<CoefficientValueWithType | null>(null)
  const [editValueForm, setEditValueForm] = useState<Record<string, string>>({})
  const [savingValue, setSavingValue] = useState(false)

  // Add value modal
  const [showAddValueModal, setShowAddValueModal] = useState(false)
  const [addingValue, setAddingValue] = useState(false)
  const [addValueForm, setAddValueForm] = useState<CreateCoefficientValueInput>({
    type_id: '',
    code: '',
    name: '',
    description: '',
    coefficient: 1,
    range_min: null,
    range_max: null,
  })

  // Delete value state
  const [deletingValue, setDeletingValue] = useState<string | null>(null)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)

  // Type management modal
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [editingType, setEditingType] = useState<CoefficientTypeRow | null>(null)
  const [typeForm, setTypeForm] = useState<CreateCoefficientTypeInput>({
    code: '',
    name: '',
    description: '',
    has_range: false,
    range_field_name: '',
    range_unit: '',
    has_description: true,
  })
  const [savingType, setSavingType] = useState(false)
  const [deletingType, setDeletingType] = useState<string | null>(null)

  // Fetch coefficient types
  const fetchTypes = useCallback(async () => {
    try {
      setTypesLoading(true)
      const data = await getCoefficientTypes()
      setCoefficientTypes(data)
      if (data.length > 0 && !activeType) {
        setActiveType(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải loại hệ số')
    } finally {
      setTypesLoading(false)
    }
  }, [activeType])

  // Fetch coefficient values
  const fetchValues = useCallback(async () => {
    if (!activeType) return

    try {
      setValuesLoading(true)
      setError(null)
      const data = await getCoefficientValues(activeType.id)
      setValues(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu')
    } finally {
      setValuesLoading(false)
    }
  }, [activeType])

  useEffect(() => {
    fetchTypes()
  }, [fetchTypes])

  useEffect(() => {
    if (activeType) {
      fetchValues()
    }
  }, [activeType, fetchValues])

  // =========== Value Management ===========

  const openEditValue = (item: CoefficientValueWithType) => {
    setEditingValue(item)
    setEditValueForm({
      name: item.name,
      description: item.description || '',
      coefficient: String(item.coefficient),
      range_min: item.range_min !== null ? String(item.range_min) : '',
      range_max: item.range_max !== null ? String(item.range_max) : '',
    })
  }

  const closeEditValue = () => {
    setEditingValue(null)
    setEditValueForm({})
  }

  const saveEditValue = async () => {
    if (!editingValue) return

    try {
      setSavingValue(true)
      const updated = await updateCoefficientValue(editingValue.id, {
        name: editValueForm.name,
        description: editValueForm.description || null,
        coefficient: Number(editValueForm.coefficient),
        range_min: editValueForm.range_min ? Number(editValueForm.range_min) : null,
        range_max: editValueForm.range_max ? Number(editValueForm.range_max) : null,
      })
      setValues(prev => prev.map(v => v.id === editingValue.id ? updated : v))
      closeEditValue()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể lưu')
    } finally {
      setSavingValue(false)
    }
  }

  const handleDeleteValue = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa hệ số này?')) return

    try {
      setDeletingValue(id)
      await deleteCoefficientValue(id)
      setValues(prev => prev.filter(v => v.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa')
    } finally {
      setDeletingValue(null)
    }
  }

  const handleDeleteAllValues = async () => {
    if (!activeType) return

    try {
      setDeletingAll(true)
      await deleteAllCoefficientValues(activeType.id)
      setValues([])
      setShowDeleteAllModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa')
    } finally {
      setDeletingAll(false)
    }
  }

  const openAddValueModal = () => {
    if (!activeType) return
    setAddValueForm({
      type_id: activeType.id,
      code: '',
      name: '',
      description: '',
      coefficient: 1,
      range_min: null,
      range_max: null,
    })
    setShowAddValueModal(true)
  }

  const handleCreateValue = async () => {
    if (!addValueForm.code || !addValueForm.name) {
      alert('Vui lòng nhập mã và tên hệ số')
      return
    }

    try {
      setAddingValue(true)
      const newValue = await createCoefficientValue(addValueForm)
      setValues(prev => [...prev, newValue])
      setShowAddValueModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể tạo hệ số')
    } finally {
      setAddingValue(false)
    }
  }

  // =========== Type Management ===========

  const openAddTypeModal = () => {
    setEditingType(null)
    setTypeForm({
      code: '',
      name: '',
      description: '',
      has_range: false,
      range_field_name: '',
      range_unit: '',
      has_description: true,
    })
    setShowTypeModal(true)
  }

  const openEditTypeModal = (type: CoefficientTypeRow) => {
    setEditingType(type)
    setTypeForm({
      code: type.code,
      name: type.name,
      description: type.description || '',
      has_range: type.has_range,
      range_field_name: type.range_field_name || '',
      range_unit: type.range_unit || '',
      has_description: type.has_description,
    })
    setShowTypeModal(true)
  }

  const handleSaveType = async () => {
    if (!typeForm.code || !typeForm.name) {
      alert('Vui lòng nhập mã và tên loại hệ số')
      return
    }

    try {
      setSavingType(true)

      if (editingType) {
        // Update existing type
        const updated = await updateCoefficientType(editingType.id, {
          name: typeForm.name,
          description: typeForm.description || null,
          has_range: typeForm.has_range,
          range_field_name: typeForm.range_field_name || null,
          range_unit: typeForm.range_unit || null,
          has_description: typeForm.has_description,
        })
        setCoefficientTypes(prev => prev.map(t => t.id === editingType.id ? updated : t))
        if (activeType?.id === editingType.id) {
          setActiveType(updated)
        }
      } else {
        // Create new type
        const newType = await createCoefficientType(typeForm)
        setCoefficientTypes(prev => [...prev, newType])
        setActiveType(newType)
      }

      setShowTypeModal(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể lưu loại hệ số')
    } finally {
      setSavingType(false)
    }
  }

  const handleDeleteType = async (id: string) => {
    if (!confirm('Xóa loại hệ số này sẽ xóa tất cả giá trị hệ số bên trong. Bạn có chắc?')) return

    try {
      setDeletingType(id)
      await deleteCoefficientType(id)
      setCoefficientTypes(prev => prev.filter(t => t.id !== id))
      if (activeType?.id === id) {
        const remaining = coefficientTypes.filter(t => t.id !== id)
        setActiveType(remaining[0] || null)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể xóa')
    } finally {
      setDeletingType(null)
    }
  }

  // =========== Render ===========

  const renderTable = () => {
    if (valuesLoading) return <LoadingSpinner />

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button onClick={fetchValues} className="px-4 py-2 bg-primary text-white rounded-lg">
            Thử lại
          </button>
        </div>
      )
    }

    if (values.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <div className="text-gray-600 font-medium">Chưa có dữ liệu hệ số</div>
        </div>
      )
    }

    return (
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên</th>
            {activeType?.has_description && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mô tả</th>
            )}
            {activeType?.has_range && (
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                {activeType.range_field_name === 'area' ? 'Diện tích' :
                 activeType.range_field_name === 'depth' ? 'Chiều sâu' :
                 activeType.range_field_name === 'width' ? 'Độ rộng' : 'Khoảng'} ({activeType.range_unit || ''})
              </th>
            )}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Hệ số</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {values.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.code}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
              {activeType?.has_description && (
                <td className="px-4 py-3 text-sm text-gray-500">{item.description || '-'}</td>
              )}
              {activeType?.has_range && (
                <td className="px-4 py-3 text-sm text-right">
                  {item.range_min ?? 0} - {item.range_max ?? 0}
                </td>
              )}
              <td className="px-4 py-3 text-sm text-right font-medium">{formatCoefficient(item.coefficient)}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => openEditValue(item)} className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg">
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteValue(item.id)}
                    disabled={deletingValue === item.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    {deletingValue === item.id ? (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <TrashIcon />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (typesLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Hệ Số</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các loại hệ số và giá trị điều chỉnh giá đất</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAddTypeModal}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-2"
          >
            <CogIcon />
            Thêm loại hệ số
          </button>
          <button
            onClick={openAddValueModal}
            disabled={!activeType}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <PlusIcon />
            Thêm giá trị
          </button>
        </div>
      </div>

      {/* No Types State */}
      {coefficientTypes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có loại hệ số nào</h3>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo loại hệ số đầu tiên</p>
          <button
            onClick={openAddTypeModal}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <PlusIcon />
            Tạo loại hệ số đầu tiên
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b overflow-x-auto">
              {coefficientTypes.map(type => (
                <div key={type.id} className="relative group">
                  <button
                    onClick={() => setActiveType(type)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeType?.id === type.id
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type.name}
                  </button>
                  {/* Type action buttons - show on hover */}
                  <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditTypeModal(type)
                      }}
                      className="p-1 bg-white rounded-full shadow text-gray-500 hover:text-primary"
                      title="Sửa loại hệ số"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteType(type.id)
                      }}
                      disabled={deletingType === type.id}
                      className="p-1 bg-white rounded-full shadow text-red-500 hover:text-red-600 disabled:opacity-50"
                      title="Xóa loại hệ số"
                    >
                      {deletingType === type.id ? (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <TrashIcon />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="text-sm text-gray-600">
                {values.length} hệ số {activeType?.name?.toLowerCase()}
              </div>
              {values.length > 0 && (
                <button
                  onClick={() => setShowDeleteAllModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon />
                  <span>Xóa tất cả</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              {renderTable()}
            </div>
          </div>
        </>
      )}

      {/* Edit Value Modal */}
      {editingValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeEditValue} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Chỉnh sửa hệ số</h2>
              <button onClick={closeEditValue} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                  type="text"
                  value={editValueForm.name || ''}
                  onChange={(e) => setEditValueForm({ ...editValueForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {activeType?.has_description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={editValueForm.description || ''}
                    onChange={(e) => setEditValueForm({ ...editValueForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    rows={2}
                  />
                </div>
              )}

              {activeType?.has_range && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min ({activeType.range_unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editValueForm.range_min || ''}
                      onChange={(e) => setEditValueForm({ ...editValueForm, range_min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max ({activeType.range_unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editValueForm.range_max || ''}
                      onChange={(e) => setEditValueForm({ ...editValueForm, range_max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hệ số</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={editValueForm.coefficient || ''}
                  onChange={(e) => setEditValueForm({ ...editValueForm, coefficient: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t">
              <button onClick={closeEditValue} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={saveEditValue} disabled={savingValue} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
                {savingValue ? 'Đang lưu...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Value Modal */}
      {showAddValueModal && activeType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddValueModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">Thêm {activeType.name}</h2>
              <button onClick={() => setShowAddValueModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={addValueForm.code}
                    onChange={(e) => setAddValueForm({ ...addValueForm, code: e.target.value })}
                    placeholder="VD: LT01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hệ số <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    value={addValueForm.coefficient}
                    onChange={(e) => setAddValueForm({ ...addValueForm, coefficient: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={addValueForm.name}
                  onChange={(e) => setAddValueForm({ ...addValueForm, name: e.target.value })}
                  placeholder="VD: Đất ở đô thị"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {activeType.has_description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={addValueForm.description || ''}
                    onChange={(e) => setAddValueForm({ ...addValueForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}

              {activeType.has_range && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min ({activeType.range_unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={addValueForm.range_min || 0}
                      onChange={(e) => setAddValueForm({ ...addValueForm, range_min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max ({activeType.range_unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={addValueForm.range_max || 0}
                      onChange={(e) => setAddValueForm({ ...addValueForm, range_max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-4 border-t">
              <button onClick={() => setShowAddValueModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleCreateValue} disabled={addingValue} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
                {addingValue ? 'Đang tạo...' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteAllModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Xóa tất cả hệ số?</h3>
              <p className="text-gray-600 mb-6">
                Bạn sắp xóa tất cả {values.length} hệ số {activeType?.name?.toLowerCase()}.
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteAllModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Hủy
                </button>
                <button onClick={handleDeleteAllValues} disabled={deletingAll} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                  {deletingAll ? 'Đang xóa...' : 'Xóa tất cả'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Type Management Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTypeModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingType ? 'Chỉnh sửa loại hệ số' : 'Thêm loại hệ số mới'}
              </h2>
              <button onClick={() => setShowTypeModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={typeForm.code}
                    onChange={(e) => setTypeForm({ ...typeForm, code: e.target.value })}
                    disabled={!!editingType}
                    placeholder="VD: custom_factor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100"
                  />
                  {!editingType && (
                    <p className="text-xs text-gray-500 mt-1">Chỉ dùng chữ cái, số và dấu gạch dưới</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hiển thị <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={typeForm.name}
                    onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })}
                    placeholder="VD: Hệ số tùy chỉnh"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={typeForm.description || ''}
                  onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                  rows={2}
                  placeholder="Mô tả về loại hệ số này..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Cấu hình trường dữ liệu</h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={typeForm.has_description}
                      onChange={(e) => setTypeForm({ ...typeForm, has_description: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Cho phép mô tả (description)</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={typeForm.has_range}
                      onChange={(e) => setTypeForm({ ...typeForm, has_range: e.target.checked })}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Có trường khoảng giá trị (min/max)</span>
                  </label>

                  {typeForm.has_range && (
                    <div className="ml-6 grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tên trường</label>
                        <select
                          value={typeForm.range_field_name || ''}
                          onChange={(e) => setTypeForm({ ...typeForm, range_field_name: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="">Chọn...</option>
                          <option value="area">Diện tích</option>
                          <option value="depth">Chiều sâu</option>
                          <option value="width">Độ rộng</option>
                          <option value="custom">Tùy chỉnh</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Đơn vị</label>
                        <input
                          type="text"
                          value={typeForm.range_unit || ''}
                          onChange={(e) => setTypeForm({ ...typeForm, range_unit: e.target.value })}
                          placeholder="VD: m², m"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t">
              <button onClick={() => setShowTypeModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={handleSaveType} disabled={savingType} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50">
                {savingType ? 'Đang lưu...' : (editingType ? 'Cập nhật' : 'Tạo mới')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
