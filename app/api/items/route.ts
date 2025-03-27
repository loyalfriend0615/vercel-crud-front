import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { z } from "zod"

// Schema for item validation
const ItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
})

// GET all items
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY created_at DESC")

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// POST new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = ItemSchema.parse(body)

    // Create new item
    const result = await pool.query("INSERT INTO items (name, description, status) VALUES ($1, $2, $3) RETURNING *", [
      validatedData.name,
      validatedData.description || null,
      validatedData.status || "active",
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}

