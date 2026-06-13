import { DataTable } from "@/components/ui/data-table"
import { priceTierQueries } from "@/features/price-tiers/queries"
import type { PriceTier } from "@/features/price-tiers/types/price-tier"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import CreatePriceTierDialog from "@/features/price-tiers/components/CreatePriceTierDialog"
import DeletePriceTierDialog from "@/features/price-tiers/components/DeletePriceTierDialog"

export const Route = createFileRoute("/price-tiers/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: priceTiers } = useQuery(priceTierQueries.list())

  const data: PriceTier[] = priceTiers?.data || []

  const columns: ColumnDef<PriceTier>[] = [
    {
      header: "Nomor",
      cell: ({ row }) => row.index + 1,
    },
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

      <DataTable columns={columns} data={data} />
    </div>
  )
}
