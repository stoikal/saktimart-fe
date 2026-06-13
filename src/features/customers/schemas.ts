import * as v from "valibot"

export const CreateCustomerSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.maxLength(100, "Maksimal 100 karakter")
  ),
  idPriceTier: v.pipe(
    v.string("Tingkat harga wajib diisi"),
    v.minLength(1, "Tingkat harga wajib diisi")
  ),
})

export type CreateCustomerInput = v.InferOutput<typeof CreateCustomerSchema>
