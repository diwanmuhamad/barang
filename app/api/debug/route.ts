import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Debug API called");

    // Test basic database connection
    const testQuery = "SELECT 1 as test";
    await query(testQuery);
    console.log("✅ Database connection successful");

    // Test each table
    const tables = ["master_kategori", "master_barang", "stock_barang"];
    const results: any = {};

    for (const table of tables) {
      try {
        const countResult = (await query(
          `SELECT COUNT(*) as count FROM ${table}`,
        )) as any[];
        const sampleResult = (await query(
          `SELECT * FROM ${table} LIMIT 1`,
        )) as any[];

        results[table] = {
          count: countResult[0].count,
          sample: sampleResult[0] || null,
        };

        console.log(`✅ ${table}: ${countResult[0].count} records`);
      } catch (error) {
        console.error(`❌ Error querying ${table}:`, error);
        results[table] = {
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    // Test the master_barang query specifically
    try {
      const masterBarangQuery = `
        SELECT
          mb.id,
          mb.kode_barang,
          mb.nama_barang,
          mb.tanggal_pembuatan,
          mk.nama_kategori as kategori,
          mb.satuan,
          mb.ada_stock,
          mb.keterangan
        FROM master_barang mb
        LEFT JOIN master_kategori mk ON mb.kategori_id = mk.id
        LIMIT 3
      `;

      const masterBarangResult = (await query(masterBarangQuery)) as any[];
      results.master_barang_joined = {
        count: masterBarangResult.length,
        data: masterBarangResult,
      };

      console.log("✅ Master barang JOIN query successful");
    } catch (error) {
      console.error("❌ Master barang JOIN query failed:", error);
      results.master_barang_joined = {
        error: error instanceof Error ? error.message : String(error),
      };
    }

    return NextResponse.json({
      success: true,
      message: "Debug information retrieved successfully",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Debug API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Debug API failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
