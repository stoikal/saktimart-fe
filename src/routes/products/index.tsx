import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { env } from "@/lib/env"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"
import CreateProductDialog from "./-components/CreateProductDialog"

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
})

type Product = {
  sku: string
  name?: string
  description?: string
  barcode?: string
}

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: products } = useQuery({
    queryKey: ["products", { page, pageSize }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      })
      const response = await fetch(
        `${env.API_BASE_URL}/api/products?${query.toString()}`
      )
      return response.json()
    },
  })

  const data: Product[] = products?.data?.elements || []
  const totalElements = products?.data?.totalElements || 0
  const totalPages = Math.ceil(totalElements / pageSize) || 1

  const columns: ColumnDef<Product>[] = [
    { header: "SKU", accessorKey: "sku" },
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    { header: "Barcode", accessorKey: "barcode" },
    {
      id: "aksi",
      header: "Aksi",
      cell: () => null,
    },
  ]

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <CreateProductDialog />
      </div>

      <DataTable columns={columns} data={data} />

      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
