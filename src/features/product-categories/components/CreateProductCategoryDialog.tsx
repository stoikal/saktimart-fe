import { useState } from "react"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  Field as FormischField,
  reset,
  useForm,
  type SubmitHandler,
} from "@formisch/react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { CreateProductCategorySChema } from "@/features/product-categories/schemas"
import { useCreateProductCategory } from "@/features/product-categories/hooks/useCreateProductCategory"

export default function CreateProductCategoryDialog() {
  const [open, setOpen] = useState(false)

  const form = useForm({
    schema: CreateProductCategorySChema,
    initialInput: {
      name: "",
      description: "",
    },
  })

  const { mutate: createProductCategory, isPending: isCreating } =
    useCreateProductCategory()

  const handleSubmit: SubmitHandler<typeof CreateProductCategorySChema> = (
    values
  ) => {
    createProductCategory(values, {
      onSuccess: () => {
        reset(form)
        setOpen(false)
        toast.success("Berhasil menambahkan kategori produk.")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Tambah
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Tambah Kategori Produk</DialogTitle>
        </DialogHeader>

        <Form
          of={form}
          onSubmit={handleSubmit}
          id="formisch-form"
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <FormischField of={form} path={["name"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel>Nama</FieldLabel>
                  <Input
                    {...field.props}
                    value={field.input ?? ""}
                    autoComplete="off"
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>

          <FieldGroup>
            <FormischField of={form} path={["description"]}>
              {(field) => (
                <Field>
                  <FieldLabel>Deskripsi</FieldLabel>
                  <Textarea
                    {...field.props}
                    value={field.input ?? ""}
                    autoComplete="off"
                  />
                  {field.errors && (
                    <FieldError
                      errors={field.errors.map((message) => ({ message }))}
                    />
                  )}
                </Field>
              )}
            </FormischField>
          </FieldGroup>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={isCreating}
              onClick={() => reset(form)}
            >
              Batal
            </Button>
          </DialogClose>

          <Button type="submit" form="formisch-form" disabled={isCreating}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
