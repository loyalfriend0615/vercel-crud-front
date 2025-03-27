import { NextResponse } from "next/server"
import pool from "@/lib/db"

// Health check endpoint to verify database connection
export async function GET() {
  try {
    // Try to query the database to verify connection
    const result = await pool.query("SELECT NOW()")

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      dbTime: result.rows[0].now,
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

