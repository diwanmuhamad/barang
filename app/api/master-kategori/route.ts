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
    const kodeKategori = searchParams.get("kode_kategori");
    const namaKategori = searchParams.get("nama_kategori");
    const keterangan = searchParams.get("keterangan");

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];

    if (kodeKategori && kodeKategori.trim()) {
      conditions.push("kode_kategori LIKE ?");
      params.push(`%${kodeKategori}%`);
    }

    if (namaKategori && namaKategori.trim()) {
      conditions.push("nama_kategori LIKE ?");
      params.push(`%${namaKategori}%`);
    }

    if (keterangan && keterangan.trim()) {
      conditions.push("keterangan LIKE ?");
      params.push(`%${keterangan}%`);
    }

    // Build WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Validate sort field
    const allowedSortFields = [
      "id",
      "kode_kategori",
      "nama_kategori",
      "keterangan",
    ];
    const validSortField = allowedSortFields.includes(sortField)
      ? sortField
      : "id";
    const validSortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Count total records
    const countSql = `
      SELECT COUNT(*) as total
      FROM master_kategori
      ${whereClause}
    `;

    const countResult = (await query(countSql, params)) as any[];
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const dataSql = `
      SELECT
        id,
        kode_kategori,
        nama_kategori,
        keterangan,
        created_at,
        updated_at
      FROM master_kategori
      ${whereClause}
      ORDER BY ${validSortField} ${validSortOrder}
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
    console.error("Error fetching master kategori:", error);
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
    const { kode_kategori, nama_kategori, keterangan } = body;

    // Validate required fields
    if (!kode_kategori || !nama_kategori) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Check if kode_kategori already exists
    const existingItem = (await query(
      "SELECT id FROM master_kategori WHERE kode_kategori = ?",
      [kode_kategori],
    )) as any[];

    if (existingItem.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode kategori already exists",
        },
        { status: 409 },
      );
    }

    // Insert new item
    const insertSql = `
      INSERT INTO master_kategori (kode_kategori, nama_kategori, keterangan)
      VALUES (?, ?, ?)
    `;

    const result = (await query(insertSql, [
      kode_kategori,
      nama_kategori,
      keterangan || null,
    ])) as any;

    // Get the created item
    const createdItem = (await query(
      `SELECT
        id,
        kode_kategori,
        nama_kategori,
        keterangan,
        created_at,
        updated_at
      FROM master_kategori
      WHERE id = ?`,
      [result.insertId],
    )) as any[];

    return NextResponse.json(
      {
        success: true,
        data: createdItem[0],
        message: "Master kategori created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating master kategori:", error);
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
