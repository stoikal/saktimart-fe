import * as v from "valibot"

export const CreatePriceTierSChema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, "Minimal 3 karakter"),
    v.maxLength(100, "Maksimal 100 karakter")
  ),
  description: v.pipe(v.string()),
})

export type CreatePriceTierInput = v.InferOutput<typeof CreatePriceTierSChema>
