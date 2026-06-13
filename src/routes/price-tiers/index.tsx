import { DataPagination } from "@/components/ui/data-pagination"
import { DataTable } from "@/components/ui/data-table"
import { priceTierQueries } from "@/features/price-tiers/queries"
import type { PriceTier } from "@/features/price-tiers/types/price-tier"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"
import CreatePriceTierDialog from "@/features/price-tiers/components/CreatePriceTierDialog"
import DeletePriceTierDialog from "@/features/price-tiers/components/DeletePriceTierDialog"

export const Route = createFileRoute("/price-tiers/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data: priceTiers } = useQuery(
    priceTierQueries.list({ page, pageSize })
  )

  const data: PriceTier[] = priceTiers?.data?.elements || []
  const totalPages = priceTiers?.data?.totalPages || 1

  const columns: ColumnDef<PriceTier>[] = [
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", accessorKey: "description" },
    {
      header: "Aksi",
      cell: ({ cell }) => (
        <DeletePriceTierDialog priceTier={cell.row.original} />
      ),
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-end">
        <CreatePriceTierDialog />
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
