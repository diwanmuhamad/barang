// Database entity types
export interface MasterBarang {
  id?: number;
  kode_barang?: string;
  nama_barang?: string;
  tanggal_pembuatan?: string;
  kategori_id?: number;
  kategori?: string;
  satuan?: string;
  ada_stock?: boolean;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
  // Display fields
  waktu?: string;
  email?: string;
  param_lokasi?: string;
  result?: string;
  id_search?: string;
}

export interface MasterKategori {
  id?: number;
  kode_kategori?: string;
  nama_kategori?: string;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
  // Display fields
  waktu?: string;
  email?: string;
  param_lokasi?: string;
  result?: string;
  id_search?: string;
}

export interface StockBarang {
  id?: number;
  nama_barang?: string;
  kategori_barang?: string;
  stock?: number;
  satuan?: string;
  barang_id?: number;
  kategori_id?: number;
  // Display fields
  waktu?: string;
  email?: string;
  param_lokasi?: string;
  result?: string;
  id_search?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

// Filter types
export interface MasterBarangFilter {
  kode_barang?: string;
  nama_barang?: string;
  tanggal_pembuatan_dari?: string;
  tanggal_pembuatan_sampai?: string;
  kategori?: string;
  satuan?: string;
  ada_stock?: boolean;
  keterangan?: string;
}

export interface MasterKategoriFilter {
  kode_kategori?: string;
  nama_kategori?: string;
  keterangan?: string;
}

export interface StockBarangFilter {
  nama_barang?: string;
  kategori_barang?: string;
  stock_min?: number;
  stock_max?: number;
  satuan?: string;
}

// Sort types
export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: string;
  order: SortOrder;
}

// Pagination types
export interface PaginationConfig {
  page: number;
  limit: number;
}

// Tab types
export type TabType = "master-barang" | "master-kategori" | "stock-barang";

// Component props types
export interface TabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onApplyFilter: (filters: any) => void;
  currentFilters: any;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortConfig?: SortConfig;
  onSort: (field: string) => void;
  loading?: boolean;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

// Database query options
export interface QueryOptions {
  filters?: Record<string, any>;
  sort?: SortConfig;
  pagination?: PaginationConfig;
}
