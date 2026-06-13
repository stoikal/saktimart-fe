import { env } from "@/lib/env"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { priceTierQueries } from "../queries"

export function useDeletePriceTier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idPriceTier: string) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/price-tiers/" + idPriceTier,
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
        queryKey: priceTierQueries.all(),
      })
    },
  })
}
