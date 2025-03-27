"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { ItemList } from "@/components/item-list"
import { ItemForm } from "@/components/item-form"
import { Button } from "@/components/ui/button"
import type { Item } from "@/types/item"
import { fetchItems } from "@/lib/api"

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      const data = await fetchItems()
      setItems(data)
      setError(null)
    } catch (err) {
      setError("Failed to load items. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setSelectedItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: Item) => {
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedItem(null)
  }

  const handleItemSaved = () => {
    loadItems()
    setIsFormOpen(false)
    setSelectedItem(null)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Item Manager</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add New Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <ItemList items={items} loading={loading} onEdit={handleEdit} onItemDeleted={loadItems} />

      {isFormOpen && <ItemForm item={selectedItem} onClose={handleFormClose} onSaved={handleItemSaved} />}
    </main>
  )
}

