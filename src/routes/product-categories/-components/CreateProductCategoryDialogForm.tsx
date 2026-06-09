import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Field as FormischField, type FormStore } from "@formisch/react"

export default function CreateProductCategoryDialogForm({ form }: { form: FormStore}) {
  return (
    <div>
      <FieldGroup>
        <FormischField of={form} path={["name"]}>
          {(field) => (
            <Field data-invalid={field.errors !== null}>
              <FieldLabel>Title</FieldLabel>
              <Input
                {...field.props}
                value={field.input}
              />
            </Field>)}
        </FormischField>
      </FieldGroup>
    </div>
  )
}
