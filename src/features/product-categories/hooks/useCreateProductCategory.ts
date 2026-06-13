import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productCategoryQueries } from "../queries"
import type { CreateProductCategoryInput } from "../schemas"
import { env } from "@/lib/env"

export function useCreateProductCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateProductCategoryInput) => {
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
      return data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productCategoryQueries.lists(),
      })
    },
  })
}
