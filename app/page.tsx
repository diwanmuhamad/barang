"use client";

import { useState, useEffect, useCallback } from "react";
import TabNavigation from "@/components/TabNavigation";
import FilterSection from "@/components/FilterSection";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import {
  TabType,
  SortConfig,
  TableColumn,
  MasterBarang,
  MasterKategori,
  StockBarang,
  ApiResponse,
} from "@/lib/types";

type DataItem = MasterBarang | MasterKategori | StockBarang;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("master-barang");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isDisplayFilter, setIsDisplayFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "id",
    order: "asc",
  });
  const [currentFilters, setCurrentFilters] = useState<Record<string, any>>({});

  const itemsPerPage = 10;

  // Master Barang columns
  const masterBarangColumns: TableColumn<DataItem>[] = [
    { key: "kode_barang", label: "Kode Barang", sortable: true },
    { key: "nama_barang", label: "Nama Barang", sortable: true },
    {
      key: "tanggal_pembuatan",
      label: "Tanggal Pembuatan",
      sortable: true,
      render: (value) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString("id-ID");
      },
    },
    { key: "kategori", label: "Kategori", sortable: true },
    { key: "satuan", label: "Satuan", sortable: true },
    {
      key: "ada_stock",
      label: "Ada Stock",
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Ya" : "Tidak"}
        </span>
      ),
    },
    { key: "keterangan", label: "Keterangan", sortable: true },
  ];

  // Master Kategori columns
  const masterKategoriColumns: TableColumn<DataItem>[] = [
    { key: "kode_kategori", label: "Kode Kategori Barang", sortable: true },
    { key: "nama_kategori", label: "Nama Kategori Barang", sortable: true },
    { key: "keterangan", label: "Keterangan", sortable: true },
  ];

  // Stock Barang columns
  const stockBarangColumns: TableColumn<DataItem>[] = [
    { key: "nama_barang", label: "Nama Barang", sortable: true },
    { key: "kategori_barang", label: "Kategori Barang", sortable: true },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (value) => <span className="font-medium">{value || 0}</span>,
    },
    { key: "satuan", label: "Satuan", sortable: true },
  ];

  const getCurrentColumns = () => {
    switch (activeTab) {
      case "master-barang":
        return masterBarangColumns;
      case "master-kategori":
        return masterKategoriColumns;
      case "stock-barang":
        return stockBarangColumns;
      default:
        return masterBarangColumns;
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortConfig.field,
        order: sortConfig.order,
        ...currentFilters,
      });

      let endpoint = "";
      switch (activeTab) {
        case "master-barang":
          endpoint = "/api/master-barang";
          break;
        case "master-kategori":
          endpoint = "/api/master-kategori";
          break;
        case "stock-barang":
          endpoint = "/api/stock-barang";
          break;
        default:
          endpoint = "/api/master-barang";
      }

      const response = await fetch(`${endpoint}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<DataItem[]> = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        setData(result.data);
        setTotalItems(result.total || 0);
        setTotalPages(Math.ceil((result.total || 0) / itemsPerPage));
      } else {
        console.error("Invalid data format:", result);
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, sortConfig, currentFilters]);

  useEffect(() => {
    setCurrentPage(1);
    setCurrentFilters({});
    setSortConfig({ field: "id", order: "asc" });
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset filter state when tab changes
  useEffect(() => {
    setIsFilterOpen(true);
  }, [activeTab]);

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleApplyFilter = (filters: Record<string, any>) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setLoading(true);
      setData([]);
      setActiveTab(tab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center mb-4">
        <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 12H5M12 19l-7-7 7-7"
            />
          </svg>
          Log Aktivitas Daftar Promosi
        </button>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex justify-end ">
        <button
          onClick={() => setIsDisplayFilter(!isDisplayFilter)}
          className="px-6 py-2 border border-yellow-500 rounded-full text-yellow-500 hover:bg-gray-50 font-medium transition-colors"
        >
          Filter
        </button>
      </div>

      {/* Filter Section */}
      <FilterSection
        isDisplayFilter={isDisplayFilter}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        activeTab={activeTab}
        onApplyFilter={handleApplyFilter}
        currentFilters={currentFilters}
      />

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          data={data}
          columns={getCurrentColumns()}
          sortConfig={sortConfig}
          onSort={handleSort}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      {!loading && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
