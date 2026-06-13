import { env } from "@/lib/env"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productCategoryQueries } from "../queries"

export function useDeleteProductCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idProductCategory: string) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/product-categories/" + idProductCategory,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productCategoryQueries.lists(),
      })
    },
  })
}
