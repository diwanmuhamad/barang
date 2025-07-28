import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

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
    const filters = {
      kode_barang: searchParams.get("kode_barang"),
      nama_barang: searchParams.get("nama_barang"),
      tanggal_pembuatan_dari: searchParams.get("tanggal_pembuatan_dari"),
      tanggal_pembuatan_sampai: searchParams.get("tanggal_pembuatan_sampai"),
      kategori: searchParams.get("kategori"),
      satuan: searchParams.get("satuan"),
      ada_stock: searchParams.get("ada_stock"),
      keterangan: searchParams.get("keterangan"),
    };

    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (filters.kode_barang) {
      whereConditions.push("mb.kode_barang LIKE ?");
      queryParams.push(`%${filters.kode_barang}%`);
    }

    if (filters.nama_barang) {
      whereConditions.push("mb.nama_barang LIKE ?");
      queryParams.push(`%${filters.nama_barang}%`);
    }

    if (filters.tanggal_pembuatan_dari) {
      whereConditions.push("mb.tanggal_pembuatan >= ?");
      queryParams.push(filters.tanggal_pembuatan_dari);
    }

    if (filters.tanggal_pembuatan_sampai) {
      whereConditions.push("mb.tanggal_pembuatan <= ?");
      queryParams.push(filters.tanggal_pembuatan_sampai);
    }

    if (filters.kategori) {
      whereConditions.push("mk.nama_kategori LIKE ?");
      queryParams.push(`%${filters.kategori}%`);
    }

    if (filters.satuan) {
      whereConditions.push("mb.satuan LIKE ?");
      queryParams.push(`%${filters.satuan}%`);
    }

    if (filters.ada_stock) {
      const stockValue = filters.ada_stock === "true" ? 1 : 0;
      whereConditions.push("mb.ada_stock = ?");
      queryParams.push(stockValue);
    }

    if (filters.keterangan) {
      whereConditions.push("mb.keterangan LIKE ?");
      queryParams.push(`%${filters.keterangan}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

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
    const countQuery = `
      SELECT COUNT(*) as total
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      ${whereClause}
    `;

    const countResult = (await query(countQuery, queryParams)) as any[];
    const total = countResult[0].total;

    // Get paginated data
    const dataQuery = `
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
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...queryParams, limit, offset];
    const results = (await query(dataQuery, dataParams)) as any[];

    // Format the response
    const response: ApiResponse<any[]> = {
      success: true,
      data: results,
      total,
      page,
      limit,
    };

    return NextResponse.json(response);
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
    const insertQuery = `
      INSERT INTO master_barang (kode_barang, nama_barang, tanggal_pembuatan, kategori_id, satuan, ada_stock, keterangan)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = (await query(insertQuery, [
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

    const response: ApiResponse<any> = {
      success: true,
      data: createdItem[0],
      message: "Master barang created successfully",
    };

    return NextResponse.json(response, { status: 201 });
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
