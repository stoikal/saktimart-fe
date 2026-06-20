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
import PageBreadcrumb from "@/components/page-breadcrumb"

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const { data: products } = useQuery(
    productQueries.list({ page, pageSize: PAGE_SIZE })
  )

  const data: Product[] = products?.data?.items || []
  const totalItems = products?.data?.totalItems || 0
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1

  const columns: ColumnDef<Product>[] = [
    { header: "SKU", accessorKey: "sku" },
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", accessorKey: "description" },
    {
      header: "Kategori",
      accessorKey: "categories",
      cell: ({ cell }) => {
        const categories = cell.row.original.categories

        return categories.map((category) => category.name).join(", ")
      },
    },
    { header: "Barcode", accessorKey: "barcode" },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ cell }) => <DeleteProductDialog product={cell.row.original} />,
    },
  ]

  return (
    <div className="p-6">
      <PageBreadcrumb items={[{ title: "Produk" }]} />

      <div className="mb-6 flex items-center justify-between">
        <h1>Daftar Produk</h1>

        <Button asChild>
          <Link to="/products/create">
            <Plus />
            Tambah
          </Link>
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
