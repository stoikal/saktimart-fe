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
import { useDeleteCustomer } from "@/features/customers/hooks/useDeleteCustomer"
import type { Customer } from "@/features/customers/types/customer"

type DeleteCustomerDialogProps = {
  customer: Customer
}

export default function DeleteCustomerDialog(props: DeleteCustomerDialogProps) {
  const [open, setOpen] = useState(false)

  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer()

  const handleDelete = () => {
    deleteCustomer(props.customer.idCustomer, {
      onSuccess: () => {
        setOpen(false)
        toast.success("Berhasil menghapus pelanggan.")
      },
      onError: () => {
        toast.error("Gagal menghapus pelanggan.")
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
          <DialogTitle>Hapus Pelanggan</DialogTitle>
        </DialogHeader>

        <p>Hapus "{props.customer.name}"?</p>

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
