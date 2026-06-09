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



type ProductCategory = {
  idProductCategory: string
  name?: string
  description?: string
}

type DeleteProductCategoryDialogProps = {
  productCategory: ProductCategory
}

export default function DeleteProductCategoryDialog(
  props: DeleteProductCategoryDialogProps
) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)


  const ProductCategoryMutation = useMutation({
    mutationFn: async (idProductCategory: string) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/product-categories/" + idProductCategory,
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
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      setOpen(false)
    }
  })

  const handleDelete = () => {
    ProductCategoryMutation.mutate(props.productCategory.idProductCategory)
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
            <Button
              variant="secondary"
              disabled={ProductCategoryMutation.isPending}
            >
              Batal
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            type="submit"
            disabled={ProductCategoryMutation.isPending}
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
