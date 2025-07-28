"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter } from "lucide-react";
import TabNavigation from "@/components/TabNavigation";
import FilterModal from "@/components/FilterModal";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      }

      const response = await fetch(`${endpoint}?${params}`);
      const result: ApiResponse<DataItem[]> = await response.json();
      console.log(response);
      if (result.success && result.data) {
        setData(result.data);
        setTotalItems(result.total || 0);
        setTotalPages(Math.ceil((result.total || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, sortConfig, currentFilters]);

  useEffect(() => {
    setCurrentPage(1);
    setCurrentFilters({});
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center">
        <button className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors">
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Log Aktivitas Daftar Promosi
        </button>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Filter Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="btn-filter flex items-center space-x-2"
        >
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={data}
        columns={getCurrentColumns()}
        sortConfig={sortConfig}
        onSort={handleSort}
        loading={loading}
      />

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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeTab={activeTab}
        onApplyFilter={handleApplyFilter}
        currentFilters={currentFilters}
      />
    </div>
  );
}
