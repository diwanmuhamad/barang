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
      kode_kategori: searchParams.get("kode_kategori"),
      nama_kategori: searchParams.get("nama_kategori"),
      keterangan: searchParams.get("keterangan"),
    };

    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (filters.kode_kategori) {
      whereConditions.push("kode_kategori LIKE ?");
      queryParams.push(`%${filters.kode_kategori}%`);
    }

    if (filters.nama_kategori) {
      whereConditions.push("nama_kategori LIKE ?");
      queryParams.push(`%${filters.nama_kategori}%`);
    }

    if (filters.keterangan) {
      whereConditions.push("keterangan LIKE ?");
      queryParams.push(`%${filters.keterangan}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

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
    const countQuery = `
      SELECT COUNT(*) as total
      FROM master_kategori
      ${whereClause}
    `;

    const countResult = (await query(countQuery, queryParams)) as any[];
    const total = countResult[0].total;

    // Get paginated data
    const dataQuery = `
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
    const insertQuery = `
      INSERT INTO master_kategori (kode_kategori, nama_kategori, keterangan)
      VALUES (?, ?, ?)
    `;

    const result = (await query(insertQuery, [
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

    const response: ApiResponse<any> = {
      success: true,
      data: createdItem[0],
      message: "Master kategori created successfully",
    };

    return NextResponse.json(response, { status: 201 });
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
