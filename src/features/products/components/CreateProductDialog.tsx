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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { env } from "@/lib/env"
import {
  Form,
  Field as FormischField,
  FieldArray,
  insert,
  remove,
  getInput,
  reset,
  useForm,
  type SubmitHandler,
} from "@formisch/react"
import { useQuery } from "@tanstack/react-query"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"
import { CreateProductSChema } from "@/features/products/schemas"
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct"

type Category = {
  idProductCategory: string
  name: string
}

export default function CreateProductDialog() {
  const [open, setOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories", { page: 1, pageSize: 100 }],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: "1",
        size: "100",
      })
      const response = await fetch(
        `${env.API_BASE_URL}/api/product-categories?${query.toString()}`
      )
      return response.json()
    },
  })

  const categories: Category[] = categoriesData?.data?.elements || []

  const form = useForm({
    schema: CreateProductSChema,
    initialInput: {
      sku: "",
      name: "",
      description: "",
      barcode: "",
      categories: [],
    },
  })

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()

  const handleSubmit: SubmitHandler<typeof CreateProductSChema> = (values) => {
    createProduct(values, {
      onSuccess: () => {
        reset(form)
        setSelectedCategoryId("")
        setOpen(false)
        toast.success("Berhasil menambahkan produk.")
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
          <DialogTitle>Tambah Produk</DialogTitle>
        </DialogHeader>

        <Form
          of={form}
          onSubmit={handleSubmit}
          id="formisch-form"
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <FormischField of={form} path={["barcode"]}>
              {(field) => (
                <Field>
                  <FieldLabel>Barcode</FieldLabel>
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

          <FieldGroup>
            <FormischField of={form} path={["sku"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel>SKU</FieldLabel>
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
            <Field>
              <FieldLabel>Kategori</FieldLabel>
              <Select
                value={selectedCategoryId}
                onValueChange={(value) => {
                  setSelectedCategoryId(value)
                  insert(form, { path: ["categories"], initialInput: value })
                  setSelectedCategoryId("")
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => {
                      const selected = getInput(form, {
                        path: ["categories"],
                      }) as string[] | undefined
                      return !selected?.includes(cat.idProductCategory)
                    })
                    .map((category) => (
                      <SelectItem
                        key={category.idProductCategory}
                        value={category.idProductCategory}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
            <FieldArray of={form} path={["categories"]}>
              {(fieldArray) => (
                <div className="mt-2 flex flex-wrap gap-2">
                  {fieldArray.items.map((itemId, index) => {
                    const categoryId = (
                      getInput(form, { path: ["categories"] }) as
                        | string[]
                        | undefined
                    )?.[index]
                    const category = categories.find(
                      (c) => c.idProductCategory === categoryId
                    )
                    return (
                      <span
                        key={itemId}
                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm"
                      >
                        {category?.name ?? categoryId}
                        <button
                          type="button"
                          onClick={() =>
                            remove(form, { path: ["categories"], at: index })
                          }
                          className="hover:text-destructive"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
            </FieldArray>
          </FieldGroup>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={isCreating}
              onClick={() => {
                reset(form)
                setSelectedCategoryId("")
              }}
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
