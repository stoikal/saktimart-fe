import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useDeletePriceTier } from "@/features/price-tiers/hooks/useDeletePriceTier"
import type { PriceTier } from "@/features/price-tiers/types/price-tier"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DeletePriceTierDialogProps = {
  priceTier: PriceTier
  disabled?: boolean
  tooltip?: string
}

export default function DeletePriceTierDialog(
  props: DeletePriceTierDialogProps
) {
  const [open, setOpen] = useState(false)

  const { mutate: deletePriceTier, isPending: isDeleting } =
    useDeletePriceTier()

  const handleDelete = () => {
    deletePriceTier(props.priceTier.idPriceTier, {
      onSuccess: () => {
        setOpen(false)
        toast.success("Berhasil menghapus tingkat harga.")
      },
      onError: () => {
        toast.error("Gagal menghapus tingkat harga.")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={props.disabled}>
              <Trash />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{props.tooltip}</TooltipContent>
      </Tooltip>

      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Hapus Tingkat Harga</DialogTitle>
        </DialogHeader>

        <p>Hapus "{props.priceTier.name}"?</p>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isDeleting}>
              Batal
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="submit"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
