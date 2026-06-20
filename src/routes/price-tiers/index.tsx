import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import CreatePriceTierDialog from "@/features/price-tiers/components/CreatePriceTierDialog"
import DeletePriceTierDialog from "@/features/price-tiers/components/DeletePriceTierDialog"
import { useUpdatePriceTierSortOrder } from "@/features/price-tiers/hooks/useUpdatePriceTierSortOrder"
import { priceTierQueries } from "@/features/price-tiers/queries"
import type { PriceTier } from "@/features/price-tiers/types/price-tier"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/table-core"
import { useState } from "react"

export const Route = createFileRoute("/price-tiers/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: priceTiers } = useQuery(priceTierQueries.list())
  const { mutateAsync: updateSortOrder, isPending: isSaving } =
    useUpdatePriceTierSortOrder()

  const data: PriceTier[] = priceTiers?.data || []

  const [isReordering, setIsReordering] = useState(false)
  const [reorderData, setReorderData] = useState<PriceTier[]>([])

  function startReordering() {
    setReorderData(data.map((item, idx) => ({ ...item, sortOrder: idx + 1 })))
    setIsReordering(true)
  }

  function cancelReordering() {
    setIsReordering(false)
    setReorderData([])
  }

  async function saveReordering() {
    await updateSortOrder(reorderData.map((item) => item.idPriceTier))
    setIsReordering(false)
    setReorderData([])
  }

  const columns: ColumnDef<PriceTier>[] = [
    {
      header: "Nomor",
      cell: ({ row }) => row.index + 1,
    },
    { header: "Nama", accessorKey: "name" },
    { header: "Deskripsi", accessorKey: "description" },
    {
      header: "Status",
      accessorKey: "isEnabled",
      cell: ({ cell }) => {
        const isEnabled = cell.getValue()
        return isEnabled ? (
          <Badge variant="outline">Aktif</Badge>
        ) : (
          <Badge variant="destructive">Tidak Aktif</Badge>
        )
      },
    },
    {
      header: "Aksi",
      cell: ({ cell }) => {
        const isDefault = cell.row.original.isDefault
        return (
          <DeletePriceTierDialog
            priceTier={cell.row.original}
            disabled={isDefault || isReordering}
            tooltip={isDefault ? "Tingkat harga utama tidak dapat dihapus" : "Hapus tingkat harga"}
          />
        )
      },
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-end gap-2">
        {isReordering ? (
          <>
            <Button variant="outline" onClick={cancelReordering}>
              Batal
            </Button>
            <Button onClick={saveReordering} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={startReordering}>
              Ubah Urutan
            </Button>
            <CreatePriceTierDialog />
          </>
        )}
      </div>

      <DataTable
        columns={columns}
        data={isReordering ? reorderData : data}
        rowIdKey={isReordering ? "idPriceTier" : undefined}
        reorderable={isReordering}
        onReorder={
          isReordering
            ? (items) =>
                setReorderData(
                  (items as PriceTier[]).map((item, idx) => ({
                    ...item,
                    sortOrder: idx + 1,
                  }))
                )
            : undefined
        }
      />
    </div>
  )
}
