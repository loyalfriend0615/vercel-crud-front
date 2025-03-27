import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { z } from "zod"

// Schema for item validation
const ItemUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "pending"]).optional(),
})

// GET single item
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

// PUT update item
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validate request body
    const validatedData = ItemUpdateSchema.parse(body)

    // Check if item exists
    const checkResult = await pool.query("SELECT * FROM items WHERE id = $1", [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Build the update query dynamically based on provided fields
    const updates = []
    const values = []
    let paramIndex = 1

    if (validatedData.name !== undefined) {
      updates.push(`name = $${paramIndex}`)
      values.push(validatedData.name)
      paramIndex++
    }

    if (validatedData.description !== undefined) {
      updates.push(`description = $${paramIndex}`)
      values.push(validatedData.description)
      paramIndex++
    }

    if (validatedData.status !== undefined) {
      updates.push(`status = $${paramIndex}`)
      values.push(validatedData.status)
      paramIndex++
    }

    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`)

    // Add id as the last parameter
    values.push(id)

    // Execute update query
    const updateQuery = `
      UPDATE items 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `

    const result = await pool.query(updateQuery, values)

    return NextResponse.json(result.rows[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

// DELETE item
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if item exists
    const checkResult = await pool.query("SELECT * FROM items WHERE id = $1", [id])

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Delete item
    await pool.query("DELETE FROM items WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}

