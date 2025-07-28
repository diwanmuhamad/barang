'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';
import { TableColumn, SortConfig } from '@/lib/types';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortConfig?: SortConfig;
  onSort: (field: string) => void;
  loading?: boolean;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sortConfig,
  onSort,
  loading = false
}: DataTableProps<T>) {
  const handleSort = (field: string, sortable?: boolean) => {
    if (sortable !== false) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string, sortable?: boolean) => {
    if (sortable === false) return null;

    const isActive = sortConfig?.field === field;

    if (isActive) {
      return sortConfig.order === 'asc' ? (
        <ChevronUp className="w-4 h-4 text-primary-600" />
      ) : (
        <ChevronDown className="w-4 h-4 text-primary-600" />
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp className="w-3 h-3 text-gray-400" />
        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white border-b border-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  className={`table-header ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(String(column.key), column.sortable)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.label}</span>
                    {getSortIcon(String(column.key), column.sortable)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">Tidak ada data</p>
                    <p className="text-sm">Data akan ditampilkan di sini ketika tersedia</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${String(column.key)}-${colIndex}-${rowIndex}`}
                      className="table-cell"
                    >
                      {column.render
                        ? column.render(item[column.key as keyof T], item)
                        : String(item[column.key as keyof T] || '-')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
