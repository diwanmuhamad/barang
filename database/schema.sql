-- Create database
CREATE DATABASE IF NOT EXISTS barang_db;
USE barang_db;

-- Create master_kategori table
CREATE TABLE IF NOT EXISTS master_kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_kategori VARCHAR(20) NOT NULL UNIQUE,
    nama_kategori VARCHAR(100) NOT NULL,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_kode_kategori (kode_kategori),
    INDEX idx_nama_kategori (nama_kategori)
);

-- Create master_barang table
CREATE TABLE IF NOT EXISTS master_barang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_barang VARCHAR(20) NOT NULL UNIQUE,
    nama_barang VARCHAR(100) NOT NULL,
    tanggal_pembuatan DATE NOT NULL,
    kategori_id INT NOT NULL,
    satuan VARCHAR(20) NOT NULL,
    ada_stock BOOLEAN DEFAULT FALSE,
    keterangan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES master_kategori(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_kode_barang (kode_barang),
    INDEX idx_nama_barang (nama_barang),
    INDEX idx_kategori_id (kategori_id),
    INDEX idx_ada_stock (ada_stock),
    INDEX idx_tanggal_pembuatan (tanggal_pembuatan)
);

-- Create stock_barang table (view-like table for stock display)
CREATE TABLE IF NOT EXISTS stock_barang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barang_id INT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (barang_id) REFERENCES master_barang(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_barang_id (barang_id),
    INDEX idx_stock (stock)
);

-- Insert sample data for master_kategori
INSERT INTO master_kategori (kode_kategori, nama_kategori, keterangan) VALUES
('KAT001', 'Elektronik', 'Kategori untuk barang elektronik'),
('KAT002', 'Furniture', 'Kategori untuk furniture dan perabotan'),
('KAT003', 'Makanan', 'Kategori untuk makanan dan minuman'),
('KAT004', 'Pakaian', 'Kategori untuk pakaian dan aksesoris'),
('KAT005', 'Olahraga', 'Kategori untuk peralatan olahraga'),
('KAT006', 'Buku', 'Kategori untuk buku dan alat tulis'),
('KAT007', 'Kesehatan', 'Kategori untuk produk kesehatan'),
('KAT008', 'Otomotif', 'Kategori untuk spare part otomotif'),
('KAT009', 'Mainan', 'Kategori untuk mainan anak-anak'),
('KAT010', 'Rumah Tangga', 'Kategori untuk peralatan rumah tangga');

-- Insert sample data for master_barang
INSERT INTO master_barang (kode_barang, nama_barang, tanggal_pembuatan, kategori_id, satuan, ada_stock, keterangan) VALUES
('BRG001', 'Smartphone Samsung Galaxy', '2024-01-15', 1, 'PCS', TRUE, 'Smartphone dengan kamera 64MP'),
('BRG002', 'Laptop ASUS ROG', '2024-01-16', 1, 'PCS', TRUE, 'Gaming laptop dengan RTX 4060'),
('BRG003', 'Meja Kantor Kayu Jati', '2024-01-17', 2, 'PCS', TRUE, 'Meja kantor premium dari kayu jati'),
('BRG004', 'Kursi Gaming RGB', '2024-01-18', 2, 'PCS', FALSE, 'Kursi gaming dengan lampu RGB'),
('BRG005', 'Kopi Arabica Premium', '2024-01-19', 3, 'KG', TRUE, 'Kopi arabica kualitas premium'),
('BRG006', 'Teh Hijau Organik', '2024-01-20', 3, 'KG', FALSE, 'Teh hijau organik tanpa pestisida'),
('BRG007', 'Kemeja Batik Pria', '2024-01-21', 4, 'PCS', TRUE, 'Kemeja batik motif tradisional'),
('BRG008', 'Sepatu Olahraga Nike', '2024-01-22', 5, 'PASANG', TRUE, 'Sepatu running Nike Air Max'),
('BRG009', 'Buku Programming Python', '2024-01-23', 6, 'PCS', FALSE, 'Buku panduan programming Python'),
('BRG010', 'Vitamin C 1000mg', '2024-01-24', 7, 'BOTOL', TRUE, 'Suplemen vitamin C untuk imunitas'),
('BRG011', 'Ban Motor Tubeless', '2024-01-25', 8, 'PCS', TRUE, 'Ban motor tubeless ukuran 110/70-17'),
('BRG012', 'Lego Technic Set', '2024-01-26', 9, 'SET', FALSE, 'Set lego technic untuk usia 8+'),
('BRG013', 'Rice Cooker Digital', '2024-01-27', 10, 'PCS', TRUE, 'Rice cooker dengan timer digital'),
('BRG014', 'Blender 3 in 1', '2024-01-28', 10, 'PCS', TRUE, 'Blender multifungsi dengan chopper'),
('BRG015', 'Headphone Wireless', '2024-01-29', 1, 'PCS', FALSE, 'Headphone bluetooth dengan noise cancelling'),
('BRG016', 'Sofa 3 Dudukan', '2024-01-30', 2, 'PCS', TRUE, 'Sofa fabric premium 3 seater'),
('BRG017', 'Mie Instan Ayam Bawang', '2024-01-31', 3, 'DUS', TRUE, 'Mie instan rasa ayam bawang isi 40 pcs'),
('BRG018', 'Jaket Hoodie Unisex', '2024-02-01', 4, 'PCS', FALSE, 'Jaket hoodie cotton fleece'),
('BRG019', 'Raket Badminton Yonex', '2024-02-02', 5, 'PCS', TRUE, 'Raket badminton profesional'),
('BRG020', 'Pensil Warna 24 Set', '2024-02-03', 6, 'SET', TRUE, 'Set pensil warna watercolor 24 pcs');

-- Insert sample data for stock_barang (only for items with ada_stock = TRUE)
INSERT INTO stock_barang (barang_id, stock) VALUES
(1, 50),   -- Smartphone Samsung Galaxy
(2, 25),   -- Laptop ASUS ROG
(3, 15),   -- Meja Kantor Kayu Jati
(5, 100),  -- Kopi Arabica Premium
(7, 30),   -- Kemeja Batik Pria
(8, 40),   -- Sepatu Olahraga Nike
(10, 200), -- Vitamin C 1000mg
(11, 80),  -- Ban Motor Tubeless
(13, 35),  -- Rice Cooker Digital
(14, 20),  -- Blender 3 in 1
(16, 12),  -- Sofa 3 Dudukan
(17, 500), -- Mie Instan Ayam Bawang
(19, 18),  -- Raket Badminton Yonex
(20, 75);  -- Pensil Warna 24 Set
