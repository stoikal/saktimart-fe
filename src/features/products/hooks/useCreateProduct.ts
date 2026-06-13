// src/features/products/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productQueries } from "../queries"
import type { CreateProductInput } from "../schemas"
import { env } from "@/lib/env"

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateProductInput) => {
      const response = await fetch(env.API_BASE_URL + "/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }
      return data
    },

    // cache invalidation on success
    onSuccess: (/** data */) => {
      // Refresh ALL product lists so the new item shows up automatically
      queryClient.invalidateQueries({
        queryKey: productQueries.lists(),
      })

      // Optional: Seed the detail cache for the new product immediately
      // queryClient.setQueryData(
      //   productQueries.detail(data.id).queryKey,
      //   data
      // )
    },
  })
}
