import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Parse sort parameters
    const sortField = searchParams.get("sort") || "id";
    const sortOrder = searchParams.get("order") || "asc";

    // Parse filter parameters
    const kodeBarang = searchParams.get("kode_barang");
    const namaBarang = searchParams.get("nama_barang");
    const tanggalDari = searchParams.get("tanggal_pembuatan_dari");
    const tanggalSampai = searchParams.get("tanggal_pembuatan_sampai");
    const kategori = searchParams.get("kategori");
    const satuan = searchParams.get("satuan");
    const adaStock = searchParams.get("ada_stock");
    const keterangan = searchParams.get("keterangan");

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (kodeBarang && kodeBarang.trim()) {
      conditions.push("mb.kode_barang LIKE ?");
      params.push(`%${kodeBarang}%`);
    }

    if (namaBarang && namaBarang.trim()) {
      conditions.push("mb.nama_barang LIKE ?");
      params.push(`%${namaBarang}%`);
    }

    if (tanggalDari && tanggalDari.trim()) {
      conditions.push("mb.tanggal_pembuatan >= ?");
      params.push(tanggalDari);
    }

    if (tanggalSampai && tanggalSampai.trim()) {
      conditions.push("mb.tanggal_pembuatan <= ?");
      params.push(tanggalSampai);
    }

    if (kategori && kategori.trim()) {
      conditions.push("mk.nama_kategori LIKE ?");
      params.push(`%${kategori}%`);
    }

    if (satuan && satuan.trim()) {
      conditions.push("mb.satuan LIKE ?");
      params.push(`%${satuan}%`);
    }

    if (adaStock && adaStock.trim()) {
      const stockValue = adaStock === "true" ? 1 : 0;
      conditions.push("mb.ada_stock = ?");
      params.push(stockValue);
    }

    if (keterangan && keterangan.trim()) {
      conditions.push("mb.keterangan LIKE ?");
      params.push(`%${keterangan}%`);
    }

    // Build WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Validate sort field
    const allowedSortFields = [
      "id",
      "kode_barang",
      "nama_barang",
      "tanggal_pembuatan",
      "kategori",
      "satuan",
      "ada_stock",
    ];
    const validSortField = allowedSortFields.includes(sortField)
      ? sortField
      : "id";
    const validSortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Build ORDER BY clause
    let orderByColumn = "";
    if (validSortField === "kategori") {
      orderByColumn = "mk.nama_kategori";
    } else {
      orderByColumn = `mb.${validSortField}`;
    }

    // Count total records
    const countSql = `
      SELECT COUNT(*) as total
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      ${whereClause}
    `;

    const countResult = (await query(countSql, params)) as any[];
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const dataSql = `
      SELECT
        mb.id,
        mb.kode_barang,
        mb.nama_barang,
        DATE_FORMAT(mb.tanggal_pembuatan, '%Y-%m-%d') as tanggal_pembuatan,
        mk.nama_kategori as kategori,
        mb.satuan,
        mb.ada_stock,
        mb.keterangan,
        mb.created_at,
        mb.updated_at
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      ${whereClause}
      ORDER BY ${orderByColumn} ${validSortOrder}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const results = (await query(dataSql, params)) as any[];

    return NextResponse.json({
      success: true,
      data: results,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching master barang:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      kode_barang,
      nama_barang,
      tanggal_pembuatan,
      kategori_id,
      satuan,
      ada_stock,
      keterangan,
    } = body;

    // Validate required fields
    if (
      !kode_barang ||
      !nama_barang ||
      !tanggal_pembuatan ||
      !kategori_id ||
      !satuan
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Check if kode_barang already exists
    const existingItem = (await query(
      "SELECT id FROM master_barang WHERE kode_barang = ?",
      [kode_barang],
    )) as any[];

    if (existingItem.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode barang already exists",
        },
        { status: 409 },
      );
    }

    // Insert new item
    const insertSql = `
      INSERT INTO master_barang (kode_barang, nama_barang, tanggal_pembuatan, kategori_id, satuan, ada_stock, keterangan)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = (await query(insertSql, [
      kode_barang,
      nama_barang,
      tanggal_pembuatan,
      kategori_id,
      satuan,
      ada_stock || false,
      keterangan || null,
    ])) as any;

    // Get the created item
    const createdItem = (await query(
      `SELECT
        mb.id,
        mb.kode_barang,
        mb.nama_barang,
        DATE_FORMAT(mb.tanggal_pembuatan, '%Y-%m-%d') as tanggal_pembuatan,
        mk.nama_kategori as kategori,
        mb.satuan,
        mb.ada_stock,
        mb.keterangan,
        mb.created_at,
        mb.updated_at
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      WHERE mb.id = ?`,
      [result.insertId],
    )) as any[];

    return NextResponse.json(
      {
        success: true,
        data: createdItem[0],
        message: "Master barang created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating master barang:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
