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
import { useQueryClient } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useDeleteProduct } from "../hooks/useDeleteProduct"
import type { Product } from "../types/product"

type DeleteProductDialogProps = {
  product: Product
}

export default function DeleteProductDialog(props: DeleteProductDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const handleDelete = () => {
    deleteProduct(props.product.idProduct, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] })
        setOpen(false)
        toast.success("Berhasil menghapus produk.")
      },
      onError: () => {
        toast.error("Gagal menghapus produk.")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Hapus Produk</DialogTitle>
        </DialogHeader>

        <p>Hapus "{props.product.name}"?</p>

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
