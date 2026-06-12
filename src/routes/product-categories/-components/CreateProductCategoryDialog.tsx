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
import { env } from "@/lib/env"
import {
  Form,
  Field as FormischField,
  reset,
  useForm,
  type SubmitHandler,
} from "@formisch/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as v from "valibot"
import { Plus } from "lucide-react"

const FormSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.maxLength(100, "Maksimal 100 karakter")
  ),
  description: v.pipe(v.string()),
})

export default function CreateProductCategoryDialog() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm({
    schema: FormSchema,
    initialInput: {
      name: "",
      description: "",
    },
  })

  const ProductCategoryMutation = useMutation({
    mutationFn: async (
      values: Parameters<SubmitHandler<typeof FormSchema>>[0]
    ) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/product-categories",
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

      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      console.log(values)
    },
    onSuccess: () => {
      reset(form)
      setOpen(false)
    },
  })

  const handleSubmit: SubmitHandler<typeof FormSchema> = (values) => {
    ProductCategoryMutation.mutate(values)
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
              disabled={ProductCategoryMutation.isPending}
              onClick={() => reset(form)}
            >
              Batal
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="formisch-form"
            disabled={ProductCategoryMutation.isPending}
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
