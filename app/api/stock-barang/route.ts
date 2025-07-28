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
    const namaBarang = searchParams.get("nama_barang");
    const kategoriBarang = searchParams.get("kategori_barang");
    const stockMin = searchParams.get("stock_min");
    const stockMax = searchParams.get("stock_max");
    const satuan = searchParams.get("satuan");

    // Build WHERE conditions - only show items with ada_stock = 1
    const conditions: string[] = ["mb.ada_stock = 1"];
    const params: any[] = [];

    if (namaBarang && namaBarang.trim()) {
      conditions.push("mb.nama_barang LIKE ?");
      params.push(`%${namaBarang}%`);
    }

    if (kategoriBarang && kategoriBarang.trim()) {
      conditions.push("mk.nama_kategori LIKE ?");
      params.push(`%${kategoriBarang}%`);
    }

    if (stockMin && stockMin.trim()) {
      conditions.push("COALESCE(sb.stock, 0) >= ?");
      params.push(parseInt(stockMin));
    }

    if (stockMax && stockMax.trim()) {
      conditions.push("COALESCE(sb.stock, 0) <= ?");
      params.push(parseInt(stockMax));
    }

    if (satuan && satuan.trim()) {
      conditions.push("mb.satuan LIKE ?");
      params.push(`%${satuan}%`);
    }

    // Build WHERE clause
    const whereClause = `WHERE ${conditions.join(" AND ")}`;

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
    const countSql = `
      SELECT COUNT(*) as total
      FROM master_barang mb
      LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
      LEFT JOIN stock_barang sb ON mb.id = sb.barang_id
      ${whereClause}
    `;

    const countResult = (await query(countSql, params)) as any[];
    const total = countResult[0]?.total || 0;

    // Get paginated data
    const dataSql = `
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

    return NextResponse.json({
      success: true,
      data: stockData[0],
      message: "Stock updated successfully",
    });
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
