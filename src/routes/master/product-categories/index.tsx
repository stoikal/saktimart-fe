import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { env } from "@/lib/env"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"

export const Route = createFileRoute("/master/product-categories/")({
  component: RouteComponent,
})

type ProductCategory = {
  idProductCategory: string
  name?: string
  description?: string
}

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 2

  const { data: productCategories } = useQuery({
    queryKey: ["product-categories", { page, pageSize }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      })
      const response = await fetch(
        `${env.API_BASE_URL}/api/master/product-categories?${query.toString()}`
      )
      return response.json()
    },
  })

  const data: ProductCategory[]= productCategories?.data?.elements || []
  const totalPages = productCategories?.data?.totalPages || 1

  const columns: ColumnDef<ProductCategory>[] = [
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", accessorKey: "description" },
    { header: "Aksi", cell: () => null}
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />

      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
