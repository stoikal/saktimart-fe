import { env } from "@/lib/env"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productQueries } from "../queries"

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idProduct: string) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/products/" + idProduct,
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
        queryKey: productQueries.lists(),
      })
    },
  })
}
