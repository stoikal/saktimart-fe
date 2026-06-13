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
import { useDeleteProductCategory } from "@/features/product-categories/hooks/useDeleteProductCategory"
import type { ProductCategory } from "@/features/product-categories/types/product-category"

type DeleteProductCategoryDialogProps = {
  productCategory: ProductCategory
}

export default function DeleteProductCategoryDialog(
  props: DeleteProductCategoryDialogProps
) {
  const [open, setOpen] = useState(false)

  const { mutate: deleteProductCategory, isPending: isDeleting } =
    useDeleteProductCategory()

  const handleDelete = () => {
    deleteProductCategory(props.productCategory.idProductCategory, {
      onSuccess: () => {
        setOpen(false)
        toast.success("Berhasil menghapus kategori produk.")
      },
      onError: () => {
        toast.error("Gagal menghapus kategori produk.")
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
          <DialogTitle>Hapus Kategori Produk</DialogTitle>
        </DialogHeader>

        <p>Hapus "{props.productCategory.name}"?</p>

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
