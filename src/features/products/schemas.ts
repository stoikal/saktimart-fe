import * as v from "valibot"

export const CreateProductSChema = v.object({
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

export type CreateProductInput = v.InferOutput<typeof CreateProductSChema>
