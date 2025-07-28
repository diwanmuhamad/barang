# Barang Management System - Setup Guide

This guide will help you set up the Barang Management System from scratch.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **MySQL 8.0+** (Download from [mysql.com](https://dev.mysql.com/downloads/))
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd barang
npm install
```

### 2. Database Setup

#### Option A: Automatic Setup (Recommended)

1. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your MySQL credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=barang_db
   ```

3. **Run Database Setup:**
   ```bash
   npm run setup-db
   ```

4. **Verify Database:**
   ```bash
   npm run check-db
   ```

#### Option B: Manual Setup

1. **Create Database:**
   ```sql
   mysql -u root -p
   CREATE DATABASE barang_db;
   USE barang_db;
   ```

2. **Import Schema:**
   ```bash
   mysql -u root -p barang_db < database/schema.sql
   ```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
barang/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── master-barang/      # Product management API
│   │   ├── master-kategori/    # Category management API
│   │   └── stock-barang/       # Stock management API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application page
├── components/                 # React components
│   ├── TabNavigation.tsx       # Tab switching component
│   ├── FilterModal.tsx         # Filter modal component
│   ├── DataTable.tsx           # Data table with sorting
│   └── Pagination.tsx          # Pagination component
├── lib/
│   ├── db.ts                   # Database connection
│   └── types.ts                # TypeScript type definitions
├── database/
│   └── schema.sql              # Database schema and sample data
├── scripts/
│   ├── setup-db.js             # Database setup script
│   └── check-db.js             # Database verification script
└── README.md                   # Project documentation
```

## Features

### 1. Three Main Tabs
- **View Aktivitas Search Pembeli** (Master Barang)
- **View Aktivitas Klik Penjual** (Master Kategori)  
- **View Aktivitas Penjual** (Stock Barang)

### 2. Functionality
- ✅ **Filtering:** Click "Filter" button to open advanced filters
- ✅ **Sorting:** Click column headers to sort data
- ✅ **Pagination:** Navigate through data (10 items per page)
- ✅ **Responsive Design:** Works on desktop and mobile
- ✅ **Sample Data:** Pre-loaded with realistic test data

## Sample Data Overview

The system comes with:
- **10 Categories:** Electronics, Furniture, Food, Clothing, etc.
- **20 Products:** Various items with complete details
- **14 Stock Records:** For products with stock enabled

## API Endpoints

### Master Barang
- `GET /api/master-barang` - List products with pagination, filtering, sorting
- `POST /api/master-barang` - Create new product

### Master Kategori  
- `GET /api/master-kategori` - List categories with pagination, filtering, sorting
- `POST /api/master-kategori` - Create new category

### Stock Barang
- `GET /api/stock-barang` - List stock data (only products with stock enabled)
- `POST /api/stock-barang` - Update stock levels

## Usage Instructions

### Navigation
1. Use the tab buttons at the top to switch between modules
2. Each tab shows different data with appropriate columns

### Filtering
1. Click the yellow "Filter" button
2. Fill in desired filter criteria in the modal
3. Click "Terapkan" to apply filters
4. Click "Reset" to clear all filters

### Sorting
1. Click any column header to sort by that field
2. Click again to reverse sort order
3. Arrow indicators show current sort direction

### Pagination
1. Use the pagination controls at the bottom
2. Shows "Menampilkan X - Y dari Z data pada kolom A dari B kolom"
3. Navigate using Previous/Next or page numbers

## Troubleshooting

### Database Connection Issues

**Error: "Database connection failed"**
- Check if MySQL server is running
- Verify credentials in `.env.local`
- Ensure database exists: `npm run setup-db`

**Error: "Access denied"**
- Check MySQL username and password
- Ensure user has proper permissions

**Error: "Connection refused"**
- Start MySQL service
- Check if MySQL is running on correct port (3306)

### Build Issues

**Error: "Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "TypeScript errors"**
```bash
npm run build
```

### Runtime Issues

**Error: "No data displayed"**
- Check browser console for API errors
- Verify database has sample data: `npm run check-db`
- Check network tab in browser dev tools

## Development

### Adding New Features

1. **New API Endpoint:**
   - Create route in `app/api/[endpoint]/route.ts`
   - Add proper types in `lib/types.ts`

2. **New Component:**
   - Create in `components/` directory
   - Import and use in main page

3. **Database Changes:**
   - Update `database/schema.sql`
   - Re-run `npm run setup-db`

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_USER=root  
DB_PASSWORD=your_password
DB_NAME=barang_db

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random-secret-key
NODE_ENV=development
```

## Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Setup
1. Set production database credentials
2. Update `NEXTAUTH_URL` to production domain
3. Set secure `NEXTAUTH_SECRET`

## Design Specifications

The application is designed to match the provided mockups:

- **Header:** Blue gradient with Home/Logout buttons
- **Tabs:** Clean tab navigation matching the design
- **Filter:** Yellow filter button with modal popup
- **Table:** Clean data table with sortable columns
- **Pagination:** Matches the "Menampilkan X dari Y" format
- **Colors:** Blue theme with consistent styling

## Support

If you encounter issues:

1. Check this setup guide
2. Verify all prerequisites are installed
3. Run `npm run check-db` to verify database
4. Check browser console for errors
5. Review the README.md for additional details

## Quick Commands Reference

```bash
# Setup
npm install
npm run setup-db
npm run check-db

# Development
npm run dev
npm run build
npm run start

# Database
npm run setup-db    # Initialize database
npm run check-db    # Verify database status
```

---

**Happy coding! 🚀**