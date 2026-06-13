import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { customerQueries } from "@/features/customers/queries"
import type { Customer } from "@/features/customers/types/customer"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"
import CreateCustomerDialog from "@/features/customers/components/CreateCustomerDialog"
import DeleteCustomerDialog from "@/features/customers/components/DeleteCustomerDialog"

export const Route = createFileRoute("/customers/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: customers } = useQuery(
    customerQueries.list(page, pageSize)
  )

  const data: Customer[] = customers?.data?.elements || []
  const totalPages = customers?.data?.totalPages || 1

  const columns: ColumnDef<Customer>[] = [
    {
      header: "Nomor",
      cell: ({ row }) => (page - 1) * pageSize + row.index + 1,
    },
    { header: "Nama", accessorKey: "name" },
    { header: "Tingkat Harga", accessorKey: "priceTierName" },
    {
      header: "Aksi",
      cell: ({ cell }) => (
        <DeleteCustomerDialog customer={cell.row.original} />
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-end">
        <CreateCustomerDialog />
      </div>

      <DataTable columns={columns} data={data} className="mb-6" />

      <DataPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
