import * as v from "valibot"

export const CreateProductCategorySChema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.maxLength(100, "Maksimal 100 karakter")
  ),
  description: v.pipe(v.string()),
})

export type CreateProductCategoryInput = v.InferOutput<typeof CreateProductCategorySChema>
