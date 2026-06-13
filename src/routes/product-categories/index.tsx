import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { productCategoryQueries } from "@/features/product-categories/queries"
import type { ProductCategory } from "@/features/product-categories/types/product-category"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"
import CreateProductCategoryDialog from "@/features/product-categories/components/CreateProductCategoryDialog"
import DeleteProductCategoryDialog from "@/features/product-categories/components/DeleteProductCategoryDialog"

export const Route = createFileRoute("/product-categories/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: productCategories } = useQuery(
    productCategoryQueries.list({ page, pageSize })
  )

  const data: ProductCategory[] = productCategories?.data?.elements || []
  const totalPages = productCategories?.data?.totalPages || 1

  const columns: ColumnDef<ProductCategory>[] = [
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", accessorKey: "description" },
    {
      header: "Aksi",
      cell: ({ cell }) => (
        <DeleteProductCategoryDialog productCategory={cell.row.original} />
      ),
    },
  ]

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-end">
        <CreateProductCategoryDialog />
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
