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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  Field as FormischField,
  reset,
  setInput,
  useForm,
  type SubmitHandler,
} from "@formisch/react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { CreateCustomerSchema } from "@/features/customers/schemas"
import { useCreateCustomer } from "@/features/customers/hooks/useCreateCustomer"
import { priceTierQueries } from "@/features/price-tiers/queries"
import { useQuery } from "@tanstack/react-query"

export default function CreateCustomerDialog() {
  const [open, setOpen] = useState(false)

  const { data: priceTiers } = useQuery(priceTierQueries.list())

  const form = useForm({
    schema: CreateCustomerSchema,
    initialInput: {
      name: "",
      idPriceTier: "",
    },
  })

  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer()

  const handleSubmit: SubmitHandler<typeof CreateCustomerSchema> = (values) => {
    createCustomer(values, {
      onSuccess: () => {
        reset(form)
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const priceTierOptions = (priceTiers?.data ?? []) as Array<{
    idPriceTier: string
    name?: string
  }>

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
          <DialogTitle>Tambah Pelanggan</DialogTitle>
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
            <FormischField of={form} path={["idPriceTier"]}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <FieldLabel>Tingkat Harga</FieldLabel>
                  <Select
                    value={field.input ?? ""}
                    onValueChange={(val) => {
                      setInput(form, { path: ["idPriceTier"], input: val })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat harga" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceTierOptions.map((tier) => (
                        <SelectItem
                          key={tier.idPriceTier}
                          value={tier.idPriceTier}
                        >
                          {tier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
