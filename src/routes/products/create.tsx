import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateProduct } from "@/features/products/hooks/useCreateProduct"
import { CreateProductSChema } from "@/features/products/schemas"
import { priceTierQueries } from "@/features/price-tiers/queries"
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
import { createFileRoute, Link } from "@tanstack/react-router"
import { ChevronLeft, X } from "lucide-react"
import { toast } from "sonner"
import { env } from "@/lib/env"
import PageBreadcrumb from "@/components/page-breadcrumb"

type Category = {
  idProductCategory: string
  name: string
}

type PriceTier = {
  idPriceTier: string
  name: string
}

export const Route = createFileRoute("/products/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({})

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

  const { data: priceTiersData } = useQuery(
    priceTierQueries.list({ isEnabled: true })
  )

  const categories: Category[] = categoriesData?.data?.elements || []
  const priceTiers: PriceTier[] = priceTiersData?.data || []

  const form = useForm({
    schema: CreateProductSChema,
    initialInput: {
      sku: "",
      name: "",
      description: "",
      barcode: "",
      categories: [],
      prices: [],
    },
  })

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()

  const handleSubmit: SubmitHandler<typeof CreateProductSChema> = (values) => {
    const prices = Object.entries(priceInputs)
      .filter(([, price]) => price.trim() !== "")
      .map(([idPriceTier, price]) => ({ idPriceTier, price }))

    const payload = {
      ...values,
      prices,
    }
    createProduct(payload, {
      onSuccess: () => {
        reset(form)
        setSelectedCategoryId("")
        setPriceInputs({})
        toast.success("Berhasil menambahkan produk.")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div className="p-6">
      <PageBreadcrumb
        items={[{ title: "Produk", to: "/products" }, { title: "Tambah" }]}
      />
      <div className="mb-6 flex justify-end">
        <Button asChild variant="secondary">
          <Link to="/products">
            <ChevronLeft />
            Kembali
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            of={form}
            onSubmit={handleSubmit}
            id="formisch-form"
            className="flex gap-6"
          >
            <div className="flex flex-1 flex-col gap-4">
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
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel>Kategori</FieldLabel>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={(value) => {
                      setSelectedCategoryId(value)
                      insert(form, {
                        path: ["categories"],
                        initialInput: value,
                      })
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
                                remove(form, {
                                  path: ["categories"],
                                  at: index,
                                })
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

              {priceTiers.length > 0 && (
                <FieldGroup>
                  <FieldLabel>Harga Jual</FieldLabel>
                  <div className="flex flex-col gap-3">
                    {priceTiers.map((tier) => (
                      <Field key={tier.idPriceTier}>
                        <FieldLabel className="text-sm font-normal text-muted-foreground">
                          {tier.name}
                        </FieldLabel>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          value={priceInputs[tier.idPriceTier] ?? ""}
                          onChange={(e) =>
                            setPriceInputs((prev) => ({
                              ...prev,
                              [tier.idPriceTier]: e.target.value,
                            }))
                          }
                          autoComplete="off"
                        />
                      </Field>
                    ))}
                  </div>
                </FieldGroup>
              )}
            </div>
          </Form>

          <div className="mt-4 flex justify-end gap-2">
            <Button asChild variant="secondary">
              <Link to="/products">Batal</Link>
            </Button>
            <Button type="submit" form="formisch-form" disabled={isCreating}>
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
