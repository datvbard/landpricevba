'use client'

interface Column {
  key: string
  header: string
  className?: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  title: string
  actions?: React.ReactNode
}

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
)

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>
)

// Action buttons for rows
export function TableActions() {
  return (
    <div className="flex gap-2">
      <button
        className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
        title="Chỉnh sửa"
      >
        <EditIcon />
      </button>
      <button
        className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors"
        title="Xóa"
      >
        <DeleteIcon />
      </button>
    </div>
  )
}

export default function DataTable({ columns, data, title, actions }: DataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
            <FilterIcon />
            Lọc
          </button>
          {actions || (
            <button className="px-4 py-2 bg-gradient-to-r from-[#AE1C3E] to-[#C42D4F] text-white rounded-md text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-shadow">
              <PlusIcon />
              Thêm mới
            </button>
          )}
        </div>
      </div>

      {/* Table with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="hover:bg-[#00843D]/5 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-gray-700 border-b border-gray-100 ${col.className || ''}`}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
