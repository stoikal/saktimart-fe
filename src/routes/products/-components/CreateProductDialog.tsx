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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as v from "valibot"
import { X } from "lucide-react"

const FormSchema = v.object({
  sku: v.pipe(
    v.string(),
    v.minLength(1, "SKU wajib diisi"),
    v.maxLength(50, "Maksimal 50 karakter")
  ),
  name: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.maxLength(100, "Maksimal 100 karakter")
  ),
  description: v.pipe(v.string()),
  barcode: v.pipe(v.string()),
  categories: v.array(v.string()),
})

type Category = {
  idProductCategory: string
  name: string
}

export default function CreateProductDialog() {
  const queryClient = useQueryClient()
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
    schema: FormSchema,
    initialInput: {
      sku: "",
      name: "",
      description: "",
      barcode: "",
      categories: [],
    },
  })

  const productMutation = useMutation({
    mutationFn: async (values: Parameters<SubmitHandler<typeof FormSchema>>[0]) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onSuccess: () => {
      reset(form)
      setSelectedCategoryId("")
      setOpen(false)
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (values) => {
    productMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah</Button>
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
                  {categories.filter((cat) => {
                    const selected = getInput(form, { path: ["categories"] }) as string[] | undefined
                    return !selected?.includes(cat.idProductCategory)
                  }).map((category) => (
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {fieldArray.items.map((itemId, index) => {
                    const categoryId = (getInput(form, { path: ["categories"] }) as string[] | undefined)?.[index]
                    const category = categories.find((c) => c.idProductCategory === categoryId)
                    return (
                      <span
                        key={itemId}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded"
                      >
                        {category?.name ?? categoryId}
                        <button
                          type="button"
                          onClick={() => remove(form, { path: ["categories"], at: index })}
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
              disabled={productMutation.isPending}
              onClick={() => {
                reset(form)
                setSelectedCategoryId("")
              }}
            >
              Batal
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="formisch-form"
            disabled={productMutation.isPending}
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
