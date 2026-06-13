import { env } from "@/lib/env"
import { queryOptions } from "@tanstack/react-query"

export const priceTierQueries = {
  all: () => ["price-tiers"] as const,
  list: () =>
    queryOptions({
      queryKey: [...priceTierQueries.all(), "list"],
      queryFn: async () => {
        const res = await fetch(`${env.API_BASE_URL}/api/price-tiers`)

        return await res.json()
      },
      staleTime: 1000 * 30,
    }),
}
