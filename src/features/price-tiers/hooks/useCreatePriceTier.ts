import { useMutation, useQueryClient } from "@tanstack/react-query"
import { priceTierQueries } from "../queries"
import type { CreatePriceTierInput } from "../schemas"
import { env } from "@/lib/env"

export function useCreatePriceTier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreatePriceTierInput) => {
      const response = await fetch(
        env.API_BASE_URL + "/api/price-tiers",
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
        queryKey: priceTierQueries.all(),
      })
    },
  })
}
