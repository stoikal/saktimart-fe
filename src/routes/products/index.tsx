import { Button } from "@/components/ui/button"
import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { productQueries } from "@/features/products/queries"
import type { Product } from "@/features/products/types/product"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { Plus } from "lucide-react"
import { useState } from "react"
import DeleteProductDialog from "../../features/products/components/DeleteProductDialog"

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const { data: products } = useQuery(
    productQueries.list({ page, pageSize: PAGE_SIZE })
  )

  const data: Product[] = products?.data?.elements || []
  const totalElements = products?.data?.totalElements || 0
  const totalPages = Math.ceil(totalElements / PAGE_SIZE) || 1

  const columns: ColumnDef<Product>[] = [
    { header: "SKU", accessorKey: "sku" },
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    { header: "Barcode", accessorKey: "barcode" },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ cell }) => <DeleteProductDialog product={cell.row.original} />,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link to="/products/create"><Plus />Tambah</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} className="mb-4" />

      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
