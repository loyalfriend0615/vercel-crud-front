import type { Item } from "@/types/item"

// Replace with your deployed backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://vercel-crud-back.vercel.app"

// Fetch all items
export async function fetchItems(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/api/items`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch items")
  }

  return response.json()
}

// Fetch a single item
export async function fetchItem(id: string): Promise<Item> {
  const response = await fetch(`${API_URL}/api/items/${id}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch item")
  }

  return response.json()
}

// Create a new item
export async function createItem(item: Omit<Item, "id" | "created_at" | "updated_at">): Promise<Item> {
  const response = await fetch(`${API_URL}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create item")
  }

  return response.json()
}

// Update an item
export async function updateItem(
  id: string,
  item: Partial<Omit<Item, "id" | "created_at" | "updated_at">>,
): Promise<Item> {
  const response = await fetch(`${API_URL}/api/items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update item")
  }

  return response.json()
}

// Delete an item
export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/items/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete item")
  }
}

