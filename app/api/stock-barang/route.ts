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
      nama_barang: searchParams.get("nama_barang"),
      kategori_barang: searchParams.get("kategori_barang"),
      stock_min: searchParams.get("stock_min"),
      stock_max: searchParams.get("stock_max"),
      satuan: searchParams.get("satuan"),
    };

    // Build WHERE clause - only show items with ada_stock = true
    const whereConditions: string[] = ["mb.ada_stock = 1"];
    const queryParams: any[] = [];

    if (filters.nama_barang) {
      whereConditions.push("mb.nama_barang LIKE ?");
      queryParams.push(`%${filters.nama_barang}%`);
    }

    if (filters.kategori_barang) {
      whereConditions.push("mk.nama_kategori LIKE ?");
      queryParams.push(`%${filters.kategori_barang}%`);
    }

    if (filters.stock_min) {
      whereConditions.push("COALESCE(sb.stock, 0) >= ?");
      queryParams.push(parseInt(filters.stock_min));
    }

    if (filters.stock_max) {
      whereConditions.push("COALESCE(sb.stock, 0) <= ?");
      queryParams.push(parseInt(filters.stock_max));
    }

    if (filters.satuan) {
      whereConditions.push("mb.satuan LIKE ?");
      queryParams.push(`%${filters.satuan}%`);
    }

    const whereClause = `WHERE ${whereConditions.join(" AND ")}`;

    // Validate sort field
    const allowedSortFields = [
      "id",
      "nama_barang",
      "kategori_barang",
      "stock",
      "satuan",
    ];
    const validSortField = allowedSortFields.includes(sortField)
      ? sortField
      : "id";
    const validSortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Build ORDER BY clause
    let orderByColumn = "";
    switch (validSortField) {
      case "nama_barang":
        orderByColumn = "mb.nama_barang";
        break;
      case "kategori_barang":
        orderByColumn = "mk.nama_kategori";
        break;
      case "stock":
        orderByColumn = "COALESCE(sb.stock, 0)";
        break;
      case "satuan":
        orderByColumn = "mb.satuan";
        break;
      default:
        orderByColumn = "mb.id";
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      LEFT JOIN stock_barang sb ON mb.id = sb.barang_id
      ${whereClause}
    `;

    const countResult = (await query(countQuery, queryParams)) as any[];
    const total = countResult[0].total;

    // Get paginated data
    const dataQuery = `
      SELECT
        mb.id,
        mb.nama_barang,
        mk.nama_kategori as kategori_barang,
        COALESCE(sb.stock, 0) as stock,
        mb.satuan,
        mb.id as barang_id,
        mk.id as kategori_id
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      LEFT JOIN stock_barang sb ON mb.id = sb.barang_id
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
    console.error("Error fetching stock barang:", error);
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
    const { barang_id, stock } = body;

    // Validate required fields
    if (!barang_id || stock === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Check if barang exists and has ada_stock = true
    const barangCheck = (await query(
      "SELECT id, ada_stock FROM master_barang WHERE id = ?",
      [barang_id],
    )) as any[];

    if (barangCheck.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Barang not found",
        },
        { status: 404 },
      );
    }

    if (!barangCheck[0].ada_stock) {
      return NextResponse.json(
        {
          success: false,
          message: "Barang does not have stock enabled",
        },
        { status: 400 },
      );
    }

    // Check if stock record already exists
    const existingStock = (await query(
      "SELECT id FROM stock_barang WHERE barang_id = ?",
      [barang_id],
    )) as any[];

    let result: any;
    if (existingStock.length > 0) {
      // Update existing stock
      result = await query(
        "UPDATE stock_barang SET stock = ? WHERE barang_id = ?",
        [stock, barang_id],
      );
    } else {
      // Insert new stock record
      result = (await query(
        "INSERT INTO stock_barang (barang_id, stock) VALUES (?, ?)",
        [barang_id, stock],
      )) as any;
    }

    // Get the updated/created stock data
    const stockData = (await query(
      `SELECT
        mb.id,
        mb.nama_barang,
        mk.nama_kategori as kategori_barang,
        sb.stock,
        mb.satuan,
        mb.id as barang_id,
        mk.id as kategori_id
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      LEFT JOIN stock_barang sb ON mb.id = sb.barang_id
      WHERE mb.id = ?`,
      [barang_id],
    )) as any[];

    const response: ApiResponse<any> = {
      success: true,
      data: stockData[0],
      message: "Stock updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating stock barang:", error);
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
