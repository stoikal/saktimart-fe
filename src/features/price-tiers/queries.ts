import { env } from "@/lib/env"
import { queryOptions } from "@tanstack/react-query"

export const priceTierQueries = {
  all: () => ["price-tiers"] as const,
  lists: () => [...priceTierQueries.all(), "list"] as const,
  list: (param: ListPriceTierParam = {}) =>
    queryOptions({
      queryKey: [...priceTierQueries.lists(), param],
      queryFn: async () => {
        const url = new URL(`${env.API_BASE_URL}/api/price-tiers`)

        Object.entries(param).forEach(([key, value]) => {
          url.searchParams.set(key, String(value))
        })

        const res = await fetch(url)

        return await res.json()
      },
      staleTime: 1000 * 30,
    }),
}

export type ListPriceTierParam = {
  isEnabled?: boolean
}
