"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  TabType,
  MasterBarangFilter,
  MasterKategoriFilter,
  StockBarangFilter,
} from "@/lib/types";

interface FilterSectionProps {
  isDisplayFilter: boolean;
  isOpen: boolean;
  onToggle: () => void;
  activeTab: TabType;
  onApplyFilter: (filters: any) => void;
  currentFilters: any;
}

export default function FilterSection({
  isDisplayFilter,
  isOpen,
  onToggle,
  activeTab,
  onApplyFilter,
  currentFilters,
}: FilterSectionProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    setFilters(currentFilters || {});
  }, [currentFilters]);

  // Reset filters when tab changes
  useEffect(() => {
    setFilters({});
  }, [activeTab]);

  const handleInputChange = (field: string, value: string) => {
    setFilters((prev: Record<string, any>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
  };

  const handleReset = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onApplyFilter(emptyFilters);
  };

  const renderMasterBarangFilters = () => (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kode Barang
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan kode barang"
          value={filters.kode_barang || ""}
          onChange={(e) => handleInputChange("kode_barang", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Barang
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan nama barang"
          value={filters.nama_barang || ""}
          onChange={(e) => handleInputChange("nama_barang", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Pembuatan
        </label>
        <div className="flex gap-2">
          <div>
            <input
              type="date"
              className="input-field text-xs"
              value={filters.tanggal_pembuatan_dari || ""}
              onChange={(e) =>
                handleInputChange("tanggal_pembuatan_dari", e.target.value)
              }
            />
          </div>
          <p className="text-gray-500 text-sm my-auto">s/d</p>
          <div>
            <input
              type="date"
              className="input-field text-xs"
              value={filters.tanggal_pembuatan_sampai || ""}
              onChange={(e) =>
                handleInputChange("tanggal_pembuatan_sampai", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan kategori"
          value={filters.kategori || ""}
          onChange={(e) => handleInputChange("kategori", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Satuan
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan satuan"
          value={filters.satuan || ""}
          onChange={(e) => handleInputChange("satuan", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ada Stock
        </label>
        <select
          className="input-field"
          value={filters.ada_stock || ""}
          onChange={(e) => handleInputChange("ada_stock", e.target.value)}
        >
          <option value="">Semua</option>
          <option value="true">Ya</option>
          <option value="false">Tidak</option>
        </select>
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keterangan
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan keterangan"
          value={filters.keterangan || ""}
          onChange={(e) => handleInputChange("keterangan", e.target.value)}
        />
      </div>
    </div>
  );

  const renderMasterKategoriFilters = () => (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kode Kategori Barang
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan kode kategori"
          value={filters.kode_kategori || ""}
          onChange={(e) => handleInputChange("kode_kategori", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Kategori Barang
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan nama kategori"
          value={filters.nama_kategori || ""}
          onChange={(e) => handleInputChange("nama_kategori", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keterangan
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan keterangan"
          value={filters.keterangan || ""}
          onChange={(e) => handleInputChange("keterangan", e.target.value)}
        />
      </div>
    </div>
  );

  const renderStockBarangFilters = () => (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Barang
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan nama barang"
          value={filters.nama_barang || ""}
          onChange={(e) => handleInputChange("nama_barang", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori Barang
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan kategori barang"
          value={filters.kategori_barang || ""}
          onChange={(e) => handleInputChange("kategori_barang", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stock
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              className="input-field text-xs"
              placeholder="0"
              value={filters.stock_min || ""}
              onChange={(e) => handleInputChange("stock_min", e.target.value)}
            />
            <label className="block text-xs text-gray-500 mb-1">
              Min Stock
            </label>
          </div>
          <div>
            <input
              type="number"
              className="input-field text-xs"
              placeholder="999"
              value={filters.stock_max || ""}
              onChange={(e) => handleInputChange("stock_max", e.target.value)}
            />
            <label className="block text-xs text-gray-500 mb-1">
              Max Stock
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Satuan
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Masukkan satuan"
          value={filters.satuan || ""}
          onChange={(e) => handleInputChange("satuan", e.target.value)}
        />
      </div>
    </div>
  );

  const renderFilterContent = () => {
    switch (activeTab) {
      case "master-barang":
        return renderMasterBarangFilters();
      case "master-kategori":
        return renderMasterKategoriFilters();
      case "stock-barang":
        return renderStockBarangFilters();
      default:
        return renderMasterBarangFilters();
    }
  };

  return (
    isDisplayFilter && (
      <div className="rounded-lg shadow-sm mb-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-medium text-gray-900">Filter</h3>
          <button
            onClick={onToggle}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <span className="mr-1">{isOpen ? "Sembunyikan" : "Tampilkan"}</span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Filter Content */}
        {isOpen && (
          <div className="p-6">
            {renderFilterContent()}

            {/* Filter Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-red-500 rounded-full text-red-500 hover:bg-gray-50 font-medium transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}
