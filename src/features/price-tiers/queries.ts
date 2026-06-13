import { env } from "@/lib/env"
import { queryOptions } from "@tanstack/react-query"

export const priceTierQueries = {
  all: () => ["price-tiers"] as const,
  lists: () => [...priceTierQueries.all(), "list"] as const,
  list: (param: ListPriceTierParam) =>
    queryOptions({
      queryKey: [...priceTierQueries.lists(), param],
      queryFn: async () => {
        const query = new URLSearchParams({
          page: String(param.page),
          size: String(param.pageSize),
        })

        const res = await fetch(
          `${env.API_BASE_URL}/api/price-tiers?${query.toString()}`
        )

        return await res.json()
      },
      staleTime: 1000 * 30,
    }),
}

export type ListPriceTierParam = {
  page: number
  pageSize: number
}
