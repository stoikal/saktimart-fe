import { useState } from "react";

export type PosSaleItem = {
  name: string
}


export default function usePosSaleItems() {
  const [items, setItems] = useState<PosSaleItem[]>([])

  const push = (item: PosSaleItem) => {
    setItems((prev) => [...prev, item])
  }

  const remove = (index: number) => {
    setItems((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1)
    ])
  }

  return {
    items,
    push,
    remove
  }
}