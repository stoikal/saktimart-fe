import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { env } from "@/lib/env"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"
import CreateProductDialog from "./-components/CreateProductCategoryDialog"
import DeleteProductCategoryDialog from "./-components/DeleteProductCategoryDialog"

export const Route = createFileRoute("/product-categories/")({
  component: RouteComponent,
})

type ProductCategory = {
  idProductCategory: string
  name?: string
  description?: string
}

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: productCategories } = useQuery({
    queryKey: ["product-categories", { page, pageSize }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
      })
      const response = await fetch(
        `${env.API_BASE_URL}/api/product-categories?${query.toString()}`
      )
      return response.json()
    },
  })

  const data: ProductCategory[]= productCategories?.data?.elements || []
  const totalPages = productCategories?.data?.totalPages || 1

  const columns: ColumnDef<ProductCategory>[] = [
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", accessorKey: "description" },
    { header: "Aksi", cell: ({ cell }) => (
      <DeleteProductCategoryDialog productCategory={cell.row.original}/>
    )}
  ]

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
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
