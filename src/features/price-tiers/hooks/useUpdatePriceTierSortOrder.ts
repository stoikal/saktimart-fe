import { env } from "@/lib/env"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { priceTierQueries } from "../queries"

export function useUpdatePriceTierSortOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/price-tiers/sort-order",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: priceTierQueries.all(),
      })
    },
  })
}
