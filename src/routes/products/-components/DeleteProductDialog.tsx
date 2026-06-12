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
import { env } from "@/lib/env"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Product = {
  idProduct: string
  name?: string
  description?: string
}

type DeleteProductDialogProps = {
  product: Product
}

export default function DeleteProductDialog(
  props: DeleteProductDialogProps
) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const deleteProductMutation = useMutation({
    mutationFn: async (idProduct: string) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/products/" + idProduct,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setOpen(false)
      toast.success("Berhasil menghapus produk.")
    },
    onError: () => {
      toast.error("Gagal menghapus produk.")
    },
  })

  const handleDelete = () => {
    deleteProductMutation.mutate(props.product.idProduct)
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
            <Button
              variant="secondary"
              disabled={deleteProductMutation.isPending}
            >
              Batal
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="submit"
            disabled={deleteProductMutation.isPending}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
