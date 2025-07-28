# Barang Management System

A Next.js application for managing inventory data with MySQL database, featuring three main modules: Master Barang, Master Kategori, and Stock Barang.

## Features

- **Three Main Tabs:**
  - **Master Barang**: Kode Barang, Nama Barang, Tanggal Pembuatan, Kategori, Satuan, Ada Stock, Keterangan
  - **Master Kategori Barang**: Kode Kategori Barang, Nama Kategori Barang, Keterangan
  - **Stock Barang**: Nama Barang, Kategori Barang, Stock, Satuan (hanya menampilkan dari master barang yang field 'Ada Stock' bernilai true)

- **Advanced Functionality:**
  - Dynamic filtering with modal interface
  - Sortable columns (click column headers to sort)
  - Pagination (10 items per page)
  - Responsive design similar to the provided mockup
  - RESTful API endpoints

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Installation

1. **Clone and setup the project:**
```bash
cd barang
npm install
```

2. **Database Setup:**
```bash
# Create MySQL database and user
mysql -u root -p

# Run the schema script
mysql -u root -p < database/schema.sql
```

3. **Environment Configuration:**
```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local with your database credentials
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### master_kategori
- `id` (Primary Key)
- `kode_kategori` (Unique)
- `nama_kategori`
- `keterangan`
- `created_at`, `updated_at`

### master_barang
- `id` (Primary Key)
- `kode_barang` (Unique)
- `nama_barang`
- `tanggal_pembuatan`
- `kategori_id` (Foreign Key)
- `satuan`
- `ada_stock` (Boolean)
- `keterangan`
- `created_at`, `updated_at`

### stock_barang
- `id` (Primary Key)
- `barang_id` (Foreign Key)
- `stock`
- `created_at`, `updated_at`

## API Endpoints

### Master Barang
- `GET /api/master-barang` - Get paginated list with filters and sorting
- `POST /api/master-barang` - Create new item

### Master Kategori
- `GET /api/master-kategori` - Get paginated list with filters and sorting
- `POST /api/master-kategori` - Create new category

### Stock Barang
- `GET /api/stock-barang` - Get stock data (only items with ada_stock=true)
- `POST /api/stock-barang` - Update stock

## Usage

### Navigation
- Use the tab buttons to switch between different modules
- Click "Filter" button to open the filter modal
- Click column headers to sort data (ascending/descending)

### Filtering
1. Click the yellow "Filter" button
2. Fill in desired filter criteria in the modal (fields change based on active tab):
   - **Master Barang**: Kode Barang, Nama Barang, Tanggal Pembuatan, Kategori, Satuan, Ada Stock, Keterangan
   - **Master Kategori**: Kode Kategori Barang, Nama Kategori Barang, Keterangan
   - **Stock Barang**: Nama Barang, Kategori Barang, Stock (min/max), Satuan
3. Click "Terapkan" to apply filters
4. Click "Reset" to clear all filters

### Sorting
- Click any column header to sort by that field
- Click again to reverse the sort order
- Visual indicators show current sort direction

### Pagination
- Navigate through pages using the pagination controls
- Shows current page info and total items
- 10 items displayed per page

## Project Structure

```
barang/
├── app/
│   ├── api/                 # API routes
│   │   ├── master-barang/
│   │   ├── master-kategori/
│   │   └── stock-barang/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/             # React components
│   ├── TabNavigation.tsx
│   ├── FilterModal.tsx
│   ├── DataTable.tsx
│   └── Pagination.tsx
├── lib/                    # Utilities
│   ├── db.ts              # Database connection
│   └── types.ts           # TypeScript types
├── database/
│   └── schema.sql         # Database schema
└── README.md
```

## Sample Data

The application comes with sample data including:
- 10 product categories (Elektronik, Furniture, Makanan, etc.)
- 20 products with various attributes
- Stock data for products with stock enabled

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=barang_db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=development
```

## Development

### Adding New Features
1. Add new API routes in `app/api/`
2. Update TypeScript types in `lib/types.ts`
3. Create new components in `components/`
4. Update the main page logic in `app/page.tsx`

### Database Migrations
1. Update `database/schema.sql`
2. Run migration scripts manually or through your preferred method

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify MySQL is running
   - Check credentials in `.env.local`
   - Ensure database exists

2. **Build Errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors in the terminal

3. **API Errors:**
   - Check browser console for error messages
   - Verify API endpoints are accessible
   - Check database connection

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is for educational/development purposes.